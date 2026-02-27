// LeetCode API Service
// Note: leetcode-query library is designed for Node.js
// For frontend use, we'll use the LeetCode GraphQL API directly through a CORS proxy or mock data

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

// Using a CORS proxy for development (you may need to use your own proxy in production)
const CORS_PROXY = 'https://corsproxy.io/?';

// GraphQL queries
const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        reputation
        starRating
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      badges {
        id
        name
        icon
        creationDate
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query getRecentSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

const SUBMISSION_CALENDAR_QUERY = `
  query getUserSubmissionCalendar($username: String!) {
    matchedUser(username: $username) {
      submissionCalendar
    }
  }
`;

// Fetch data from LeetCode GraphQL API
async function fetchFromLeetCode(query, variables) {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(LEETCODE_GRAPHQL_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from LeetCode');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('LeetCode API Error:', error);
    throw error;
  }
}

// Get problem difficulty from recent submissions
async function getProblemDifficulty(titleSlug) {
  const query = `
    query getProblemData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        difficulty
      }
    }
  `;
  
  try {
    const data = await fetchFromLeetCode(query, { titleSlug });
    return data?.question?.difficulty || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

// Main function to fetch all LeetCode data
export async function fetchLeetCodeData(username) {
  try {
    // Fetch profile and contest data
    const profileData = await fetchFromLeetCode(USER_PROFILE_QUERY, { username });
    
    // Fetch recent submissions
    const submissionsData = await fetchFromLeetCode(RECENT_SUBMISSIONS_QUERY, { 
      username, 
      limit: 20 
    });

    // Fetch submission calendar
    const calendarData = await fetchFromLeetCode(SUBMISSION_CALENDAR_QUERY, { username });

    // Process the data
    const user = profileData?.matchedUser;
    const contestRanking = profileData?.userContestRanking;
    const allQuestions = profileData?.allQuestionsCount || [];

    // Parse problem stats
    const submitStats = user?.submitStatsGlobal?.acSubmissionNum || [];
    const totalQuestions = {};
    
    allQuestions.forEach(q => {
      totalQuestions[q.difficulty.toLowerCase()] = q.count;
    });

    const problemStats = {
      easy: { solved: 0, total: totalQuestions.easy || 0 },
      medium: { solved: 0, total: totalQuestions.medium || 0 },
      hard: { solved: 0, total: totalQuestions.hard || 0 },
    };

    submitStats.forEach(stat => {
      const diff = stat.difficulty.toLowerCase();
      if (problemStats[diff]) {
        problemStats[diff].solved = stat.count;
      }
    });

    // Parse recent submissions and add difficulty
    const recentSubmissions = submissionsData?.recentAcSubmissionList || [];
    
    // Get difficulty for each submission (batch with delay to avoid rate limiting)
    const submissionsWithDifficulty = await Promise.all(
      recentSubmissions.map(async (sub, index) => {
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, index * 100));
        const difficulty = await getProblemDifficulty(sub.titleSlug);
        return {
          ...sub,
          difficulty,
        };
      })
    );

    // Parse submission calendar for the monthly progress
    const calendarJson = calendarData?.matchedUser?.submissionCalendar;
    let submissions = [];
    
    if (calendarJson) {
      const calendar = JSON.parse(calendarJson);
      submissions = Object.entries(calendar).map(([timestamp, count]) => ({
        timestamp: parseInt(timestamp),
        count,
        // For calendar we don't have difficulty, we'll use recent submissions for that
      }));
    }

    // Merge submissions with difficulty data from recent submissions
    const submissionsWithDetails = submissionsWithDifficulty.map(sub => ({
      timestamp: parseInt(sub.timestamp),
      difficulty: sub.difficulty,
      title: sub.title,
      lang: sub.lang,
      statusDisplay: sub.statusDisplay || 'Accepted'
    }));

    return {
      profile: {
        username: user?.username,
        realName: user?.profile?.realName,
        avatar: user?.profile?.userAvatar,
        ranking: user?.profile?.ranking,
        reputation: user?.profile?.reputation || 0,
        starRating: user?.profile?.starRating || 0,
        contributionPoints: 0,
      },
      contestInfo: {
        attended: contestRanking?.attendedContestsCount || 0,
        rating: contestRanking?.rating || 0,
        globalRanking: contestRanking?.globalRanking || 0,
        topPercentage: contestRanking?.topPercentage || 0,
      },
      problemStats,
      badges: user?.badges || [],
      recentSubmissions: submissionsWithDifficulty.map(sub => ({
        ...sub,
        timestamp: parseInt(sub.timestamp),
        statusDisplay: sub.statusDisplay || 'Accepted'
      })),
      submissions: submissionsWithDetails,
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    
    // Return mock data for testing when API fails
    return generateMockData(username);
  }
}

// Mock data generator for testing/development
function generateMockData(username) {
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  // Generate random submissions for the current month
  const submissions = [];
  for (let i = 0; i < 30; i++) {
    if (Math.random() > 0.5) {
      const timestamp = now - (i * day) - Math.floor(Math.random() * 86400);
      submissions.push({
        timestamp,
        difficulty: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'Medium' : 'Hard') : 'Easy',
        title: `Problem ${i + 1}`,
      });
    }
  }

  return {
    profile: {
      username: username,
      realName: 'LeetCode User',
      avatar: null,
      ranking: Math.floor(Math.random() * 500000) + 1,
      reputation: Math.floor(Math.random() * 1000),
      contributionPoints: Math.floor(Math.random() * 500),
    },
    contestInfo: {
      attended: Math.floor(Math.random() * 50),
      rating: Math.floor(Math.random() * 1000) + 1200,
      globalRanking: Math.floor(Math.random() * 100000),
      topPercentage: Math.random() * 50,
    },
    problemStats: {
      easy: { solved: Math.floor(Math.random() * 300) + 50, total: 850 },
      medium: { solved: Math.floor(Math.random() * 400) + 100, total: 1800 },
      hard: { solved: Math.floor(Math.random() * 100) + 20, total: 750 },
    },
    badges: [
      { name: '50 Days Badge 2024', icon: null, creationDate: now - 30 * day },
      { name: 'Annual Badge', icon: null, creationDate: now - 60 * day },
      { name: 'Knight Badge', icon: null, creationDate: now - 90 * day },
    ],
    recentSubmissions: [
      { title: 'Two Sum', difficulty: 'Easy', timestamp: now - 3600, lang: 'python3', statusDisplay: 'Accepted' },
      { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', timestamp: now - 7200, lang: 'python3', statusDisplay: 'Accepted' },
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', timestamp: now - day, lang: 'javascript', statusDisplay: 'Accepted' },
      { title: 'Add Two Numbers', difficulty: 'Medium', timestamp: now - day * 2, lang: 'python3', statusDisplay: 'Accepted' },
      { title: 'Container With Most Water', difficulty: 'Medium', timestamp: now - day * 3, lang: 'cpp', statusDisplay: 'Accepted' },
    ],
    submissions,
  };
}

export default fetchLeetCodeData;

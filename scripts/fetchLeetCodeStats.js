const { LeetCode } = require('leetcode-query');
const fs = require('fs');
const path = require('path');

const USERNAME = 'krisha-cmd';

async function fetchLeetCodeStats() {
  const leetcode = new LeetCode();

  try {
    console.log(`Fetching data for user: ${USERNAME}`);

    // Fetch user profile
    const user = await leetcode.user(USERNAME);
    
    // Fetch recent submissions
    const recentSubmissions = await leetcode.recent_submissions(USERNAME, 20);
    
    // Fetch user contest info
    const contestInfo = await leetcode.user_contest_info(USERNAME);

    // Process problem stats
    const submitStats = user?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const allQuestions = user?.allQuestionsCount || [];
    
    const totalQuestions = {};
    allQuestions.forEach(q => {
      totalQuestions[q.difficulty.toLowerCase()] = q.count;
    });

    const problemStats = {
      easy: { solved: 0, total: totalQuestions.easy || 850 },
      medium: { solved: 0, total: totalQuestions.medium || 1800 },
      hard: { solved: 0, total: totalQuestions.hard || 750 },
    };

    submitStats.forEach(stat => {
      const diff = stat.difficulty.toLowerCase();
      if (problemStats[diff]) {
        problemStats[diff].solved = stat.count;
      }
    });

    // Get difficulty for recent submissions
    const submissionsWithDifficulty = [];
    for (const sub of recentSubmissions.slice(0, 15)) {
      try {
        const problem = await leetcode.problem(sub.titleSlug);
        submissionsWithDifficulty.push({
          title: sub.title,
          titleSlug: sub.titleSlug,
          timestamp: parseInt(sub.timestamp),
          lang: sub.lang,
          statusDisplay: sub.statusDisplay || 'Accepted',
          difficulty: problem?.difficulty || 'Unknown'
        });
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        submissionsWithDifficulty.push({
          title: sub.title,
          titleSlug: sub.titleSlug,
          timestamp: parseInt(sub.timestamp),
          lang: sub.lang,
          statusDisplay: sub.statusDisplay || 'Accepted',
          difficulty: 'Unknown'
        });
      }
    }

    // Build the data object
    const data = {
      lastUpdated: new Date().toISOString(),
      profile: {
        username: user?.matchedUser?.username || USERNAME,
        realName: user?.matchedUser?.profile?.realName || '',
        avatar: user?.matchedUser?.profile?.userAvatar || null,
        ranking: user?.matchedUser?.profile?.ranking || 0,
        reputation: user?.matchedUser?.profile?.reputation || 0,
        contributionPoints: user?.matchedUser?.contributions?.points || 0,
      },
      contestInfo: {
        attended: contestInfo?.userContestRanking?.attendedContestsCount || 0,
        rating: contestInfo?.userContestRanking?.rating || 0,
        globalRanking: contestInfo?.userContestRanking?.globalRanking || 0,
        topPercentage: contestInfo?.userContestRanking?.topPercentage || 0,
      },
      problemStats,
      badges: user?.matchedUser?.badges || [],
      recentSubmissions: submissionsWithDifficulty,
      submissionCalendar: user?.matchedUser?.submissionCalendar || '{}',
    };

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write to public folder
    const outputPath = path.join(publicDir, 'leetcode-stats.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Successfully fetched and saved LeetCode stats!');
    console.log(`📊 Problems solved: Easy ${problemStats.easy.solved}, Medium ${problemStats.medium.solved}, Hard ${problemStats.hard.solved}`);
    console.log(`🏆 Contest Rating: ${data.contestInfo.rating}`);
    console.log(`📁 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error fetching LeetCode stats:', error.message);
    process.exit(1);
  }
}

fetchLeetCodeStats();

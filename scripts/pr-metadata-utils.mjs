const answerPathPattern = /^answers\/([^/]+)\/([A-Z]+-\d+)\.md$/i;
const generatedStart = "<!-- pr-metadata:start -->";
const generatedEnd = "<!-- pr-metadata:end -->";

export function findAnswer(files) {
  const answers = files
    .map((file) => file.filename ?? file)
    .map((filename) => filename.match(answerPathPattern))
    .filter(Boolean)
    .map((match) => ({
      githubId: match[1],
      questionId: match[2].toUpperCase(),
    }));

  if (answers.length !== 1) {
    throw new Error(
      `PR에는 answers/<github-id>/<질문-id>.md 답변 파일이 정확히 1개 필요합니다. 현재 ${answers.length}개입니다.`,
    );
  }
  return answers[0];
}

export function buildTitle({ questionId, githubId }) {
  return `[CS][${questionId}] ${githubId}`;
}

export function buildBody({ body = "", questionId, githubId, issue }) {
  const generated = [
    generatedStart,
    "## 제출 정보",
    "",
    `- 질문 Issue: ${issue ? `#${issue.number} — ${issue.html_url}` : "연결된 Issue를 찾지 못했습니다."}`,
    `- 질문 ID: \`${questionId}\``,
    `- 작성자: @${githubId}`,
    generatedEnd,
  ].join("\n");

  const withoutGenerated = body
    .replace(
      new RegExp(`${generatedStart}[\\s\\S]*?${generatedEnd}\\s*`, "g"),
      "",
    )
    .trim();

  return withoutGenerated ? `${generated}\n\n${withoutGenerated}` : generated;
}

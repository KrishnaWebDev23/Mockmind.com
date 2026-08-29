import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type QuestionScore = {
  score: number;
  topic: string;
  question: string;
};

type QuestionsBarchartProps = {
  questionScores: QuestionScore[];
};

const QuestionsBarchart = ({
  questionScores,
}: QuestionsBarchartProps) => {
  const chartData = questionScores.map((item, index) => ({
    question: `Q${index + 1}`,
    score: item.score,
    topic: item.topic,
    fullQuestion: item.question,
  }));

  const getBarColor = (score: number) => {
    if (score >= 8) return "#22c55e";
    if (score >= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:p-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h3 className="text-lg font-semibold text-white sm:text-xl">
          Question Performance
        </h3>

        <p className="mt-1 text-xs leading-5 text-zinc-400 sm:text-sm">
          Individual score for each interview question
        </p>
      </div>

      {/* Chart */}
      <div className="w-full min-w-0 overflow-x-auto">
        <div
          className="
            h-64
            min-w-107.5
            sm:h-72
            sm:min-w-0
            lg:h-80
          "
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#27272a"
                vertical={false}
              />

              <XAxis
                dataKey="question"
                stroke="#a1a1aa"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 11,
                }}
                tickMargin={8}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#a1a1aa"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 11,
                }}
                width={30}
              />

              <Tooltip
                cursor={{
                  fill: "#27272A",
                }}
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#fff",
                  maxWidth: "280px",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
                labelStyle={{
                  color: "#fff",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `${value}/10`,
                  "Score",
                ]}
                labelFormatter={(label) => {
                  const item = chartData.find(
                    (entry) => entry.question === label
                  );

                  return item
                    ? `${item.question} · ${item.topic}`
                    : label;
                }}
              />

              <Bar
                dataKey="score"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
                maxBarSize={48}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getBarColor(entry.score)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuestionsBarchart;
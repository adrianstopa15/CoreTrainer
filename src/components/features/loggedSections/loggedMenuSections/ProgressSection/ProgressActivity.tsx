import React from "react";

export default function ProgressActivity() {
  return (
    <>
      <div style={{ width: "50%", height: "400px" }}>
        <ResponpsiveContainer>
          <PieChart>
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              iconSize={10}
            />
            <Pie
              data={muscleGroupData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
            >
              {muscleGroupData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#333" }}
            />
          </PieChart>
        </ResponpsiveContainer>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Sector, Cell, ResponsiveContainer } from 'recharts';
 
export default function PieChartComponent({ chartData }) {

    const [colors, setColors] = useState([]);
 
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        setColors(chartData.map((entry, index) => `hsl(${index * 50}, 70%, 50%)`));
    }, [chartData]);
 
    return (

            <div>
                <div class="row d-flex justify-content-center text-center">
                    <div className="col-md-8">
                        <ResponsiveContainer width={800} height={800} className="text-center">
                            <PieChart width={800} height={800}>
                                <Legend layout="horizontal" verticalAlign="top" align="top" />
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={300}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                    nameKey="mbti"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
    )
}
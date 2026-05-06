const rand = (min: number, max: number) =>
  +(min + Math.random() * (max - min)).toFixed(1);
const randInt = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

export const genTelemetry = () =>
  Array.from({ length: 10 }, (_, i) => ({
    time: `${i * 5}m`,
    cpu: rand(35, 88),
    memory: rand(28, 75),
    net: rand(10, 60),
  }));

export const genLatency = () => [
  { region: "AMER-EAST",    value: rand(8, 20),   status: "healthy" },
  { region: "EMEA-CENTRAL", value: rand(18, 40),  status: "healthy" },
  { region: "APAC-NORTH",   value: rand(80, 200), status: "warning" },
  { region: "LATAM-SOUTH",  value: rand(45, 90),  status: "healthy" },
  { region: "APAC-SOUTH",   value: rand(30, 70),  status: "healthy" },
];

export const genTransactions = () =>
  Array.from({ length: 12 }, (_, i) => ({
    hour: `${i * 2}:00`,
    volume: randInt(12000, 48000),
    failed: randInt(10, 200),
    value: rand(1.2, 8.9),
  }));

export const genSecurityEvents = () =>
  Array.from({ length: 8 }, (_, i) => ({
    hour: `${i * 3}h`,
    threats: randInt(0, 45),
    blocked: randInt(20, 180),
    anomalies: randInt(0, 12),
  }));

export const genNodes = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `NODE-${String(i + 1).padStart(3, "0")}`,
    region: ["US-EAST", "EU-WEST", "AP-SOUTH", "US-WEST"][i % 4],
    cpu: rand(20, 95),
    mem: rand(30, 90),
    disk: rand(40, 85),
    status:
      Math.random() > 0.85
        ? Math.random() > 0.5 ? "warning" : "critical"
        : "healthy",
    uptime: `${randInt(10, 365)}d ${randInt(0, 23)}h`,
  }));
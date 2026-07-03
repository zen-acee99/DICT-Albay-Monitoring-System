export default function parseData(rawData) {

  const records = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,

    amArrival: '',
    amDeparture: '',

    pmArrival: '',
    pmDeparture: '',

    underHours: '',
    underMins: '',

    note: '',
    isMerged: false
  }));


  let detectedMonth = null;


  if (!rawData?.trim()) {
    return {
      records,
      detectedMonth
    };
  }

 console.log(rawData)

  const lines = rawData
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);



  lines.forEach(line => {

  const cleanLine = line
    .replace(/,/g, " ")
    .replace(/([a-z])(\d)/gi, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  const match = cleanLine.match(/^(\d+)(\d{2})-(\d{2})/);

  if (!match) return;

  const recordNumber = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  detectedMonth = month - 1;

  const record = records[day - 1];

  const times =
    [...cleanLine.matchAll(/(\d{1,2}:\d{2})\s*(am|pm)/gi)]
      .map(m => m[1]);

  if (recordNumber % 2 === 1) {
    record.amArrival = times[0] || "";
    record.amDeparture = times[1] || "";
  } else {
    record.pmArrival = times[0] || "";
    record.pmDeparture = times[1] || "";
  }

  });

  

  return {
    records,
    detectedMonth
  };

}
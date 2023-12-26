import moment from "moment";

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

const getDays = (year: number, month: string, block_number: number) => {
  let days = [];
  let date = moment(`${year}-${month}-016`);
  let num = date.daysInMonth();
  for (let i = 0; i < num; i++) {
    days.push({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      dayOfWeek: dayOfWeek[date.day()],
      block_number,
    });
    date.add(1, "day");
    block_number++;
  }

  return days;
};

const getCalendar = (reactiveData: any) => {
  let block_number = 0;
  let days;
  let start_month = moment(reactiveData.start_month);
  let end_month = moment(reactiveData.end_month);
  let between_month = end_month.diff(start_month, "months");
  for (let i = 0; i <= between_month; i++) {
    days = getDays(start_month.year(), start_month.format("MM"), block_number);

    reactiveData.calendars = {
      days,
      date: start_month.format("YYYY年MM月"),
    };

    start_month.add(1, "months");
    block_number = days[days.length - 1].block_number;
    block_number++;
  }

  return block_number;
};

export { getCalendar };

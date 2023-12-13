import moment from "moment";
import momentTimeZone from "moment-timezone";

const getDayInUTC = (date: Date) => {
  const dateInJST = momentTimeZone(date);

  const dateInUTC = dateInJST.tz("Europe/London").date();

  return dateInUTC;
};

const formatCurrentDate = () => {
  const currentDate = moment().format("YYYY-MM-DD");
  return currentDate;
};

// TODO ロジックがかなり複雑になってるので、リファクタリングを行いロジックを可能な限りシンプルにしたい。
// TODO 戻り値のstartDateは`000Z`、endDateは`999Z`のミリ秒単位まで指定できていないので、可能ならミリ秒単位まで指定したい。
// TODO サーバー側の関数を参照しており、endDateは本来使用しない値なのでリファクタリングを行う必要がある。
function calcDuringMonth(inputDate: string) {
  const date = moment(inputDate);
  const MAX_INTEGER_ONE_DIGIT = 9;

  const year = String(date.year());
  const month =
    date.month() + 1 <= MAX_INTEGER_ONE_DIGIT
      ? `0${date.month() + 1}`
      : String(date.month() + 1);
  const day =
    date.date() <= MAX_INTEGER_ONE_DIGIT
      ? `${date.date()}`
      : String(date.date());

  const STARTING_DATE_OF_THE_MONTH = "16";
  const END_DATE_OF_THE_MONTH = "15";

  const timeZone = "Europe/London";
  let startBaseDate;
  let endBaseDate;

  const theMonthDegreeDecember = checkTheMonthDegreeDecemberOrJanuary(
    year,
    month,
    day
  );
  if (theMonthDegreeDecember) return theMonthDegreeDecember;

  const isCurrentMonth =
    moment(`${year}-${month}-${day}`) >=
    moment(`${year}-${month}-${STARTING_DATE_OF_THE_MONTH}`);

  if (isCurrentMonth) {
    const nextMonth =
      Number(month) + 1 <= MAX_INTEGER_ONE_DIGIT
        ? `0${Number(month) + 1}`
        : Number(month) + 1;

    startBaseDate = `${year}-${month}-${STARTING_DATE_OF_THE_MONTH}`;
    endBaseDate = `${year}-${nextMonth}-${END_DATE_OF_THE_MONTH}`;

    return {
      startDate: momentTimeZone
        .tz(startBaseDate, timeZone)
        .startOf("day")
        .format(),
      endDate: momentTimeZone.tz(endBaseDate, timeZone).endOf("day").format(),
    };
  } else {
    const lastMonth =
      Number(month) - 1 <= MAX_INTEGER_ONE_DIGIT
        ? `0${Number(month) - 1}`
        : Number(month) - 1;

    startBaseDate = `${year}-${lastMonth}-${STARTING_DATE_OF_THE_MONTH}`;
    endBaseDate = `${year}-${month}-${END_DATE_OF_THE_MONTH}`;

    return {
      startDate: momentTimeZone
        .tz(startBaseDate, timeZone)
        .startOf("day")
        .format(),
      endDate: momentTimeZone.tz(endBaseDate, timeZone).endOf("day").format(),
    };
  }

  // inputDateの日付の値が、12月16日から、1月15日の間の日付かどうかを確認する。
  function checkTheMonthDegreeDecemberOrJanuary(
    year: string,
    month: string,
    day: string
  ) {
    const date = moment(`${year}-${month}-${day}`);
    const STARTING_DATE_OF_THE_MONTH = "16";
    const END_DATE_OF_THE_MONTH = "15";
    const DECEMBER = "12";
    const JANUARY = "01";

    if (month === DECEMBER) {
      const isTheMonthDegreeDecember =
        date >= moment(`${year}-${month}-${STARTING_DATE_OF_THE_MONTH}`) &&
        date <=
          moment(`${Number(year) + 1}-${JANUARY}-${END_DATE_OF_THE_MONTH}`);
      if (!isTheMonthDegreeDecember) return false;

      startBaseDate = `${year}-${month}-${STARTING_DATE_OF_THE_MONTH}`;
      endBaseDate = `${Number(year) + 1}-${JANUARY}-${END_DATE_OF_THE_MONTH}`;

      return {
        startDate: momentTimeZone
          .tz(startBaseDate, timeZone)
          .startOf("day")
          .format(),
        endDate: momentTimeZone.tz(endBaseDate, timeZone).endOf("day").format(),
      };
    }

    if (month === JANUARY) {
      const isTheMonthDegreeJanuary =
        date >=
          moment(
            `${Number(year) - 1}-${DECEMBER}-${STARTING_DATE_OF_THE_MONTH}`
          ) && date <= moment(`${year}-${month}-${END_DATE_OF_THE_MONTH}`);
      if (!isTheMonthDegreeJanuary) return false;

      startBaseDate = `${
        Number(year) - 1
      }-${DECEMBER}-${STARTING_DATE_OF_THE_MONTH}`;
      endBaseDate = `${year}-${month}-${END_DATE_OF_THE_MONTH}`;

      return {
        startDate: momentTimeZone
          .tz(startBaseDate, timeZone)
          .startOf("day")
          .format(),
        endDate: momentTimeZone.tz(endBaseDate, timeZone).endOf("day").format(),
      };
    }

    return false;
  }
}

const caluCurrentMonthly = () => {
  const currentDate = formatCurrentDate();
  const { startDate } = calcDuringMonth(currentDate);
  const year = moment(startDate).year();
  const month = moment(startDate).month() + 1;
  const cuurentMonthly = `${year}-${month}`;
  return cuurentMonthly;
};

export { getDayInUTC, calcDuringMonth, formatCurrentDate, caluCurrentMonthly };

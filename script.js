const getDOMElements = () => {
  return {
    dateInput: document.querySelector('.dateInput'),
    outputRes: document.querySelector(".outputRes"),
    container: document.querySelector(".container")
  }
}

const reverseString = (stringToReverse) => {
  const stringArr = stringToReverse.split('');
  stringArr.reverse();
  return stringArr.join('');
}

const isPallindrome = (stringToCheck) => {
  return stringToCheck === reverseString(stringToCheck);
}

const convertDateToString = (date) => {
  const dateStr = {day: '',month: '',year: ''};
  let dayString = date.day.toString();
  let monthString = date.month.toString();
  if(date.day < 10){
    dayString = '0' + date.day.toString();
  }

  if(date.month < 10){
    monthString = '0' + date.month.toString();
  }

  dateStr.day = dayString;
  dateStr.month = monthString;
  dateStr.year = date.year.toString();
  return dateStr;
}

const getAllDateFormats = (date) => {
  const dateStrObject = convertDateToString(date);
  const ddmmyyyy = dateStrObject.day + dateStrObject.month + dateStrObject.year;
  const mmddyyyy = dateStrObject.month + dateStrObject.day + dateStrObject.year;
  const yyyymmdd = dateStrObject.year + dateStrObject.month + dateStrObject.day;
  const ddmmyy = dateStrObject.day + dateStrObject.month + dateStrObject.year.slice(-2);
  const mmddyy = dateStrObject.month + dateStrObject.day + dateStrObject.year.slice(-2);
  const yymmdd = dateStrObject.year.slice(-2) + dateStrObject.month + dateStrObject.day;

  return [ddmmyyyy,mmddyyyy,yyyymmdd,ddmmyy,mmddyy,yymmdd];
}

const checkPallindromeForAllDateFormats = (date) => {
  const allDateFormats = getAllDateFormats(date);
  let pallindromeFound = false;
  allDateFormats.some(dateFormat => {
    if(isPallindrome(dateFormat)){
      pallindromeFound = true;
      return true;
    }
  });
  return pallindromeFound;
}

const isLeapYear = (year) => {
  if(year%400 === 0){
    return true;
  }

  if(year%100 === 0){
    return false;
  }

  if(year%4 === 0){
    return true;
  }
  return false;
}

const getFuturePallindromicDate = (date) => {
  let gapOfFutureDays = 0;
  let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
  while(true){
    if(checkPallindromeForAllDateFormats(date)){
      break;
    }

    if(isLeapYear(date.year)){
      daysInMonth[1] = 29;
    }
    else{
      daysInMonth[1] = 28;
    }

    gapOfFutureDays += 1;
    if(date.day === daysInMonth[date.month-1]){
      date.day = 1;
      if(date.month === 12){
        date.month = 0;
        date.year += 1;
      }
      date.month += 1;
    }
    else{
      date.day += 1;
    }
  }

  return [gapOfFutureDays,date];
}

const getPastPallindromicDate = (date) => {
  let gapOfPastDays = 0;
  let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
  while(true){
    if(checkPallindromeForAllDateFormats(date)){
      break;
    }

    if(isLeapYear(date.year)){
      daysInMonth[1] = 29;
    }
    else{
      daysInMonth[1] = 28;
    }

    gapOfPastDays += 1;
    if(date.day === 1){
      if(date.month === 1){
        date.month = 12;
        date.year -= 1;
      }
      date.month -= 1;
      date.day = daysInMonth[date.month];
    }
    else{
      date.day -= 1;
    }
  }

  return [gapOfPastDays,date];
}

const getNearestDate = (date) => {
  let currentDate1 = {...date};
  const [gapOfPastDays,pastPallindromicDate] = getPastPallindromicDate(currentDate1);
  let currentDate2 = {...date};
  const [gapOfFutureDays,futurePallindromicDate] = getFuturePallindromicDate(currentDate2);

  if(gapOfFutureDays < gapOfPastDays){
    return ["future",gapOfFutureDays,futurePallindromicDate];
  }
  else{
    return ["past",gapOfPastDays,pastPallindromicDate];
  }
}

const constructDate = (date) => {
  return date.day.toString() + "-" + date.month.toString() + "-" + date.year.toString();
}

const handleClick = () => {
  const dateInputVal = getDOMElements().dateInput.value;
  if(dateInputVal){
    const dateInputArr = dateInputVal.split('-');
    let date = {
      day: parseInt(dateInputArr[2]),
      month: parseInt(dateInputArr[1]),
      year: parseInt(dateInputArr[0])
    };

    if(checkPallindromeForAllDateFormats(date)){
      getDOMElements().outputRes.innerHTML = "Hurray! your birthday is pallindromic date";
      getDOMElements().container.style.backgroundColor = "#D1FAE5";
    }
    else{
      const [timeLine,gap,pallindromicDate] = getNearestDate(date);
      getDOMElements().outputRes.innerHTML = "You missed by " + gap + " days from " + timeLine + " date i.e " + constructDate(pallindromicDate);
      getDOMElements().container.style.backgroundColor = "#FEE2E2";
    }
  }
  else{
    alert("enter date");
  }
}


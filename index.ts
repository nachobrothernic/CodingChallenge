import { DueDate } from "./method";

const Test = new DueDate()

let DateTest = new Date(2025, 2, 9, 9, 30);
let Result = Test.CalculateDueDate(DateTest, 90);

console.log(Result.toLocaleString());
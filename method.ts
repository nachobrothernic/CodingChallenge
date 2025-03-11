export class DueDate {
    /**
     * Define working hours and time conversions
     */
    private readonly StartOfDay: number = 9; // Start of the working day (9 AM)
    private readonly WorkingHoursPerDay: number = 8; // Number of working hours per day
    private readonly EndOfDay: number = this.StartOfDay + this.WorkingHoursPerDay; // End of the working day (5 PM)
    private readonly IgnoredDaysOfTheWeek: number[] = [0, 6]; // Non-working days (Sunday and Saturday)
    private readonly OneHourToMilliseconds: number = 60 * 60 * 1000; // Conversion factor for hours to milliseconds

    /**
     * Class constructor initializing remaining time and current date.
     * @param {number} RemainingMilliseconds - Remaining milliseconds to process.
     * @param {Date} CurrentDate - The current date being processed.
     */
    constructor(
        private RemainingMilliseconds: number = 0,
        private CurrentDate: Date = new Date()
    ) {}

    /**
     * Calculates the due date based on the given start date and turnaround time.
     * @param {Date} StartDate - The starting date and time of submission.
     * @param {number} TurnaroundTime - The turnaround time in working hours.
     * @returns {Date} - The resolved due date.
     */
    public CalculateDueDate(StartDate: Date, TurnaroundTime: number): Date {
        this.InitializeDueDateCalculation(StartDate, TurnaroundTime);

        while (this.RemainingMilliseconds > 0) { // While we break inside, this is better than just a while(true)
            // If current day is not a valid working day, move to the next working day
            if (!this.IsValidWorkingDay(this.CurrentDate)) {
                this.MoveToNextWorkingDay();
                continue;
            }

            // Calculate the remaining work hours for the current day
            let RemainingToday = this.CalculateRemainingMillisecondsToday();

            if (this.RemainingMilliseconds <= RemainingToday) {
                this.AddRemainingMillisecondsToDate();
                break;
            }

            this.RemainingMilliseconds -= RemainingToday;
            this.MoveToNextWorkingDay();
        }

        return this.CurrentDate;
    }

    /**
     * Initiates the primary data points for the DueDate calculation to occur
     * @param {Date} StartDate - The date to start from.
     * @param {number} TurnaroundTime - The number, in hours, for a task to be due by
     */
    private InitializeDueDateCalculation(StartDate: Date, TurnaroundTime: number): void {
        this.RemainingMilliseconds = TurnaroundTime * this.OneHourToMilliseconds;
        this.CurrentDate = new Date(StartDate);
    }

    /**
     * Finalizes the remaining Milliseconds left to obtain a specific time on the current day.
     * @param {number} RemainingToday - The number, in milliseconds, to add to the current date to obtain the current Date object
     */
    private AddRemainingMillisecondsToDate() {
        this.CurrentDate.setTime(this.CurrentDate.getTime() + this.RemainingMilliseconds);
        this.RemainingMilliseconds = 0;
    }

    /**
     * Returns the remaining milliseconds in the current work day
     * @returns {number} - The milliseconds remaining for the task to complete or the end of the day
     */
    private CalculateRemainingMillisecondsToday(): number {
        let EndOfToday = new Date(this.CurrentDate);
        EndOfToday.setHours(this.EndOfDay, 0, 0, 0);
        // In the event we start later, assume 0 work is done and not negative work.
        return Math.max(0, EndOfToday.getTime() - this.CurrentDate.getTime());
    }

    /**
     * Checks if the given date is a valid working day.
     * @param {Date} Date - The date to check.
     * @returns {boolean} - True if it is a valid working day, false otherwise.
     */
    private IsValidWorkingDay(Date: Date): boolean {
        return this.IsWeekday(Date) && !this.IsHoliday(Date);
    }

    /**
     * Checks if the given date falls on a weekday.
     * @param {Date} Date - The day of the week to check. (0 Sunday, 6 Saturday)
     * @returns {boolean} - True if it is a weekday, false if it is a weekend.
     */
    private IsWeekday(Date: Date): boolean {
        return !this.IgnoredDaysOfTheWeek.includes(Date.getDay());
    }

    /**
     * Determines if the given date is a holiday.
     * I decided to implement this anyway, but have it always return false just because it flowed better in my mind as I wrote it.
     * @param {Date} Date - The date to check.
     * @returns {boolean} - False (no holidays implemented yet).
     */
    private IsHoliday(Date: Date): boolean {
        return false; 
    }

    /**
     * Moves the current date to the next available working day.
     */
    private MoveToNextWorkingDay(): void {
        do {
            this.CurrentDate.setDate(this.CurrentDate.getDate() + 1);
        } while (!this.IsValidWorkingDay(this.CurrentDate));
        this.CurrentDate.setHours(this.StartOfDay, 0, 0, 0);
    }
}
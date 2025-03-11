import { DueDate } from "../method";

// Describe the test suite for CalculateDueDate method
describe('testing the CalculateDueDate method', () => {
    let DueDateObject: DueDate;

    // Before each test, initialize a new DueDate object
    beforeEach(() => {
        DueDateObject = new DueDate();
    });

    // Test 1: Verify that projects lasting until the end of the day are completed on the same day
    test('projects that last until the end of the day should be done same-day', () => {
        // Initialize the start date (March 10, 2025, 9:30 AM) and turnaround time (7.5 hours)
        const StartDate = new Date(2025, 2, 10, 9, 30);
        const Turnaround = 7.5;

        // Calculate the due date using the CalculateDueDate method
        const Result: Date = DueDateObject.CalculateDueDate(StartDate, Turnaround);

        // Assert that the due date falls on the same day as the start date
        expect(Result.getDate()).toBe(StartDate.getDate());
    });

    // Test 2: Verify that a project lasting for a day on Friday ends on the following Monday
    test('project that lasts for a day should be completed on the following Monday', () => {
        // Initialize the start date (March 14, 2025, 12:00 PM) and turnaround time (8 hours)
        const StartDate = new Date(2025, 2, 14, 12, 0);
        const Turnaround = 8;

        // Calculate the due date using the CalculateDueDate method
        const Result: Date = DueDateObject.CalculateDueDate(StartDate, Turnaround);

        // Assert that the project ends on Monday (getDay returns 1 for Monday)
        expect(Result.getDay()).toBe(1); // Monday
    });

    // Test 3: Verify that a project starting on Monday at 9 AM with 40 hours of work ends on Friday
    test('project started on monday at 9AM and worked for 8 * 5 hours, should end on friday', () => {
        // Initialize the start date (March 10, 2025, 9:00 AM) and turnaround time (40 hours)
        const StartDate = new Date(2025, 2, 10, 9, 0);
        const Turnaround = 8 * 5;

        // Calculate the due date using the CalculateDueDate method
        const Result: Date = DueDateObject.CalculateDueDate(StartDate, Turnaround);

        // Assert that the project ends on Friday (getDay returns 5 for Friday)
        expect(Result.getDay()).toBe(5); // Friday
    });

    // Test 4: Verify that a project starting on Wednesday at 12:30 PM with 14.5 hours of work finishes on Friday at 11:00 AM
    test('project starting March 12th at 12:30PM, worked for 14.5 hours, should finish on Friday, March 14th at 11:00AM', () => {
        // Initialize the start date (March 12, 2025, 12:30 PM) and turnaround time (14.5 hours)
        const StartDate = new Date(2025, 2, 12, 12, 30);
        const Turnaround = 14.5;

        // Calculate the due date using the CalculateDueDate method
        const Result: Date = DueDateObject.CalculateDueDate(StartDate, Turnaround);

        // Assert that the project ends on Friday (getDay should return 5 for Friday)
        expect(Result.getDay()).toBe(5); // Friday

        // Assert that the due date time is 11:00 AM on Friday
        expect(Result.getHours()).toBe(11); // 11 AM
        expect(Result.getMinutes()).toBe(0); // 00 minutes
    });

    // Test 5: Verify that a project starting on Friday at 12PM, for 8 continuous work days, lasts for two weeks, successfully ignores non-working days, and ends at 12PM on a Friday
    test('a project starting on friday at 12PM and lasts for 8 hours * 10 work days should end in two weeks on Friday', () => {
        const StartDate = new Date(2025, 2, 14, 12, 0);
        const Turnaround = 8 * 10;

        // Calculate the due date using the CalculateDueDate method
        const Result: Date = DueDateObject.CalculateDueDate(StartDate, Turnaround);

        // Assert that the project ends on Friday (getDay should return 5 for Friday)
        expect(Result.getDay()).toBe(5); // Friday
        expect(Result.getDate()).toBe(28); // Two weeks from March 14th, 2025
        // Assert that the due date time is 12:00 AM on Friday
        expect(Result.getHours()).toBe(12); // 12 PM
        expect(Result.getMinutes()).toBe(0); // 00 minutes
    })

});
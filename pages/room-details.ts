import { expect, type Locator, type Page } from '@playwright/test';
import { Guests } from '../utils/dataStructures/guests';


export class RoomDetailsPage {
    readonly page: Page;
    readonly pageLoadedIndicator: Locator;
    readonly totalGuestsCounterLocator: Locator;
    readonly closeModalButtonLocator: Locator;
    readonly guestsInputPickerLocator: Locator;
    readonly guestsSummaryLocator: Locator;
    readonly reserveButtonLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageLoadedIndicator = page.getByTestId('book-it-default');
        this.totalGuestsCounterLocator = page.locator('#GuestPicker-book_it-trigger');
        this.closeModalButtonLocator = page.getByTestId('modal-container').getByLabel('Close');
        this.guestsInputPickerLocator = page.locator('[aria-labelledby="GuestPicker-book_it-form"]');
        this.guestsSummaryLocator = page.locator('[aria-labelledby="guests-label GuestPicker-book_it-trigger"]');
        this.reserveButtonLocator = page.getByRole('button', { name: 'Reserve' });
    }

    async verifyPageHasLoaded () {
        await this.page.waitForLoadState("domcontentloaded");
        // Close Translation modal if appears (within 10 seconds)
        await this.closeModalButtonLocator.click({ timeout: 10000 });
        expect(this.pageLoadedIndicator).toBeVisible;
    }

    async verifyDateIsCorrect (date: Date, dateType: string) {
        let dateString = date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' });
        expect(this.page.getByTestId(`change-dates-${dateType}`)).toHaveText(dateString);
    }

    async verifyGuestsAreCorrect (guests: Guests) {
        if (await this.guestsInputPickerLocator.isHidden()) {
            await this.guestsSummaryLocator.click();
        }
        for (let guestType of Object.keys(guests) as Array<keyof Guests>) {
            expect(this.page.getByTestId(`GuestPicker-book_it-form-${guestType}-stepper-value`)).toHaveText(guests[guestType].toString());
        }
        await this.guestsSummaryLocator.click();
    }

    async doReservation () {
        await this.reserveButtonLocator.click();
    }
}
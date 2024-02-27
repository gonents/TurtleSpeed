import { expect, type Locator, type Page } from '@playwright/test';
import { Guests } from '../../utils/dataStructures/guests';

const maxGuestsLimit = 15;

export class TabPanelPage {
    readonly page: Page;
    readonly parentLocator: Locator;
    readonly searchButtonLocator: Locator;
    readonly destionationsInputLocator: Locator;
    readonly searchSuggestionsLocator: Locator;
    readonly firstResultLocator: Locator;
    readonly checkinDateInputLocator: Locator;
    readonly checkoutDateInputLocator: Locator;
    readonly datesInputPanelLocator: Locator;
    readonly dateMoveForwardLocator: Locator;
    readonly guestsInputLocator: Locator;
    readonly guestsInputPanelLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.parentLocator = page.locator('#search-tabpanel');
        this.searchButtonLocator = this.parentLocator.getByTestId('structured-search-input-search-button');

        // Destinations tab
        this.destionationsInputLocator = this.parentLocator.getByTestId('structured-search-input-field-query');
        this.searchSuggestionsLocator = this.parentLocator.getByTestId('structured-search-input-field-query-panel');
        this.firstResultLocator = this.searchSuggestionsLocator.getByTestId('option-0');

        // Dates tab
        this.checkinDateInputLocator = this.parentLocator.getByTestId('structured-search-input-field-split-dates-0');
        this.checkoutDateInputLocator = this.parentLocator.getByTestId('structured-search-input-field-split-dates-1');
        this.datesInputPanelLocator = page.getByTestId('structured-search-input-field-dates-panel');
        this.dateMoveForwardLocator = this.parentLocator.getByLabel('Move forward to switch to the next month.');

        // Guests tab
        this.guestsInputLocator = this.parentLocator.getByTestId('structured-search-input-field-guests-button');
        this.guestsInputPanelLocator = this.parentLocator.getByTestId('structured-search-input-field-guests-panel');
    }

    async goto () {
        await this.page.goto('/');
    }

    async enterDestination (destination: string) {
        await this.destionationsInputLocator.fill(destination);
    }

    async pickDates (checkinDate: Date, checkoutDate: Date) {
        await this.checkinDateInputLocator.click()
        await this.moveToMonth(checkinDate);
        await this.chooseSpecificDate(checkinDate);
        await this.checkoutDateInputLocator.click();
        await this.moveToMonth(checkoutDate);
        await this.chooseSpecificDate(checkoutDate);
    }

    async moveToMonth (date: Date) {
        // Airbnb limits date searches to maximum 23 months ahead
        const maxDate = new Date(date.getFullYear() + 2, date.getMonth() - 1, date.getDate())
        while (date <= maxDate) {
            let checkinMonthAndYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            let currentMonthYear = await this.datesInputPanelLocator.innerText();
            if (currentMonthYear.includes(checkinMonthAndYear)) {
                break;
            }
            await this.dateMoveForwardLocator.click();
        }
    }

    async chooseSpecificDate (date: Date) {
        let dateString = date.toLocaleString('default', { month: '2-digit', day: '2-digit', year: 'numeric' });
        let dateLocatorTestId = `calendar-day-${dateString}`;
        await this.page.getByTestId(dateLocatorTestId).click();
    }

    async changeGuests (guests: Guests) {
        if (await this.guestsInputPanelLocator.isHidden()) {
            await this.guestsInputLocator.click();
        }
        for (let guestType of Object.keys(guests) as Array<keyof Guests>) {
            await this.adjustGuestValue(guestType, guests[guestType]);
        }
    }

    async adjustGuestValue (guestType: String, desireValue: number) {
        let guestValueLocator = this.parentLocator.getByTestId(`stepper-${guestType}-value`);
        let currentValue = parseInt(await guestValueLocator.innerText());
        if (desireValue == currentValue) { return; };
        let guestValueGap = desireValue - currentValue;
        let actionType = guestValueGap > 0 ? 'increase' : 'decrease';
        for (let actionCount = 0; actionCount < guestValueGap; actionCount++) {
            await this.parentLocator.getByTestId(`stepper-${guestType}-${actionType}-button`).click();
        }
        expect(parseInt(await guestValueLocator.innerText())).toEqual(desireValue);
    }

    async doSearch () {
        await this.searchButtonLocator.click();
    }
}
import { expect, type Locator, type Page } from '@playwright/test';
import { Guests } from '../utils/dataStructures/guests';
import { URLSearchParams } from 'url';


export class BookDetailsPage {
    readonly page: Page;
    readonly pageLoadedIndicator: Locator;
    readonly pageUrlIndicator: String;

    constructor(page: Page) {
        this.page = page;
        this.pageLoadedIndicator = page.getByTestId('price-item-total');
        this.pageUrlIndicator = '/book/';
    }

    async verifyPageHasLoaded () {
        await this.page.waitForLoadState("domcontentloaded");
        expect(this.pageLoadedIndicator).toBeVisible;
    }

    async verifyUrlIsValid (guests: Guests) {
        let urlString = this.page.url();
        expect(urlString).toContain(this.pageUrlIndicator);
        let urlSearchParams = new URLSearchParams(urlString.toLowerCase());
        for (let guestType of Object.keys(guests) as Array<keyof Guests>) {
            expect(guests[guestType].toString()).toEqual(urlSearchParams.get(`numberof${guestType}`));
        }
    }
}
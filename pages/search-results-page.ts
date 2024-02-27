import { expect, type Locator, type Page, type BrowserContext } from '@playwright/test';

const maxGuestsLimit = 15;

export class SearchResultsPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly pageUrlIndicator: String
    readonly firstSearchResultsCard: Locator;
    readonly filterResultsButtonLocator: Locator;
    readonly filterMostLovedButtonLocator: Locator;
    readonly applyFilterButtonLocator: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.pageUrlIndicator = '/s/';
        this.firstSearchResultsCard = page.getByTestId('card-container');
        this.filterResultsButtonLocator = page.getByTestId('category-bar-filter-button');
        this.filterMostLovedButtonLocator = page.getByRole('button').getByText("The most loved");
        this.applyFilterButtonLocator = page.locator('[href*="search_type=filter_change"]').getByText("Show");
    }


    async verifySearchResultsDisplayed (searchString: string) {
        await this.page.waitForLoadState('domcontentloaded');
        expect(this.firstSearchResultsCard.first()).toBeVisible();
        expect(this.page.url()).toContain(this.pageUrlIndicator);
        for (let element of await this.page.getByText(searchString).all()) {
            expect(element).toBeVisible();
        }
    }

    async filterResultsByGuestsHighestRank () {
        await this.filterResultsButtonLocator.click();
        await this.filterMostLovedButtonLocator.click();
        await this.applyFilterButtonLocator.click();
        await this.page.waitForLoadState("domcontentloaded");
        await this.firstSearchResultsCard.first().isVisible();
    }

    async chooseFirstResult () {
        const pagePromise = this.context.waitForEvent('page');
        await this.firstSearchResultsCard.first().click();
        // The link in opened in a new tab
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
}
import { test } from '@playwright/test';
import { TabPanelPage } from '../pages/homepage/search-tabpanel';
import { SearchResultsPage } from '../pages/search-results-page';
import { Guests } from '../utils/dataStructures/guests';
import { RoomDetailsPage } from '../pages/room-details';
import { BookDetailsPage } from '../pages/book-page';


test('Search in AirBNB', async ({ page, context }) => {
    
    // [Task #1 - Search for a stay]
    // 1. Navigate to Airbnb homepage
    const tabPanelPage = new TabPanelPage(page);
    await tabPanelPage.goto();

    // 2. Enter a destination
    const destinationName = 'Manhattan';
    await tabPanelPage.enterDestination(destinationName);
    
    // 3. Pick checkin (tomorrow) and checkout (day after tomorrow) dates
    let checkinDate = new Date();
    checkinDate.setDate(new Date().getDate() + 1);
    let checkoutDate = new Date();
    checkoutDate.setDate(new Date().getDate() + 2);
    await tabPanelPage.pickDates(checkinDate, checkoutDate);

    // 4. Enter guests: 2 adults, 1 children
    let guests: Guests = { adults: 2, children: 1, infants: 0, pets: 0 }
    await tabPanelPage.changeGuests(guests);
    
    // 5. Search and verify search results
    await tabPanelPage.doSearch();
    const searchResultsPage = new SearchResultsPage(page, context);
    await searchResultsPage.verifySearchResultsDisplayed(destinationName)

    // [Task #2 - Select a listing]
    // 6. Filter by guests' highest-rated and select the first item
    await searchResultsPage.filterResultsByGuestsHighestRank();
    const propertyPage = await searchResultsPage.chooseFirstResult();

    // [Task #3 - Confirm booking details]
    // 7. Verify dates and guests are correct as expected
    const roomDetailsPage = new RoomDetailsPage(propertyPage);
    await roomDetailsPage.verifyPageHasLoaded();
    await roomDetailsPage.verifyDateIsCorrect(checkinDate, 'checkIn');
    await roomDetailsPage.verifyDateIsCorrect(checkoutDate, 'checkOut');
    await roomDetailsPage.verifyGuestsAreCorrect(guests);
    
    // [Task #6 - Reserve and validate]
    // 8. Do a reservation and verify url, dates and guests has correct values
    await roomDetailsPage.doReservation();
    const bookDetailsPage = new BookDetailsPage(propertyPage);
    await bookDetailsPage.verifyPageHasLoaded();
    await bookDetailsPage.verifyUrlIsValid(guests);
});


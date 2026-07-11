Feature: Google Flights – Round Trip Search

  @google-flights
  Scenario: Search for a round-trip flight from San Diego to Chicago and select the first airline
    Given I am on the Google Flights page
    When I set the flight origin to "San Diego"
    And I set the flight destination to "Chicago"
    And I set the departure date to "April 1, 2026"
    And I set the return date to "April 15, 2026"
    And I click the Search button
    Then I should see the flight results
    When I select the first flight result
    Then the return flight selection page should be shown

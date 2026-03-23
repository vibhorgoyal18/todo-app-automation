@todos @auth:required
Feature: Todo Management
  As a logged-in user
  I want to manage my todos
  So that I can keep track of my tasks

  Background:
    Given I navigate to the Todos page

  Scenario: Add a new todo
    When I click the Add Todo button
    And I fill in the todo title "Buy groceries"
    And I submit the todo form
    Then I should see a todo item "Buy groceries" in the list

  Scenario: Add a todo with all fields
    When I click the Add Todo button
    And I fill in the todo title "Write tests"
    And I fill in the description "Cover all scenarios"
    And I select status "In Progress"
    And I select priority "High"
    And I fill in the tags "testing, automation"
    And I submit the todo form
    Then I should see a todo item "Write tests" in the list

  Scenario: Edit an existing todo
    When I click edit on the todo "Set up CI pipeline"
    And I update the todo title to "Set up CI/CD pipeline"
    And I save the todo changes
    Then I should see a todo item "Set up CI/CD pipeline" in the list

  Scenario: Delete a todo
    When I click delete on the todo "Set up CI pipeline"
    And I confirm the delete dialog
    Then I should not see "Set up CI pipeline" in the todo list

  Scenario: Mark a todo as done
    When I check the checkbox for todo "Set up CI pipeline"
    Then the todo "Set up CI pipeline" should be marked as done

  Scenario: Filter todos by status
    When I filter todos by status "Done"
    Then I should see a todo item "Review PR" in the list
    And I should not see "Write Playwright tests" in the todo list

  Scenario: Filter todos by priority
    When I filter todos by priority "High"
    Then I should see a todo item "Write Playwright tests" in the list
    And I should not see "Set up CI pipeline" in the todo list

  Scenario: Search for a todo
    When I search for "Playwright"
    Then I should see a todo item "Write Playwright tests" in the list
    And I should not see "Review PR" in the todo list

  Scenario: Cancel adding a todo
    When I click the Add Todo button
    And I fill in the todo title "Temporary todo"
    And I cancel the todo form
    Then I should not see "Temporary todo" in the todo list

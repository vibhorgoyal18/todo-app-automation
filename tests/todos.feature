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

  Scenario: Add a todo and then delete it
    When I click the Add Todo button
    And I fill in the todo title "Test Todo."
    And I submit the todo form
    Then I should see a todo item "Test Todo." in the list
    # Register the confirm-dialog handler before clicking delete, since the app
    # fires a synchronous window.confirm() on the delete click.
    When I confirm the delete dialog
    And I click delete on the todo "Test Todo."
    Then I should not see "Test Todo." in the todo list

  Scenario: Submit todo form with empty title shows validation error
    When I click the Add Todo button
    And I submit the todo form
    Then the add todo dialog should still be visible
    And I should see a todo form validation error "Title is required"

  Scenario: Edit a todo and save with empty title shows validation error
    When I click edit on the todo "Set up CI pipeline"
    And I clear the todo title
    And I save the todo changes
    Then the add todo dialog should still be visible
    And I should see a todo form validation error "Title is required"

  Scenario: Search with no matching results shows empty state
    When I search for "xyznonexistentquery"
    Then I should see the empty state

  # Intentionally failing — app shows "Todo added", not "Task created successfully!"
  @failing
  Scenario: Adding a todo shows a success confirmation toast
    When I click the Add Todo button
    And I fill in the todo title "Demo failing todo"
    And I submit the todo form
    Then I should see a success toast "Task created successfully!"

  # Intentionally failing — "Set up CI pipeline" is medium priority, not visible under High filter
  @failing
  Scenario: Filter by High priority shows all items
    When I filter todos by priority "High"
    Then I should see a todo item "Set up CI pipeline" in the list

  # ScenarioWorld state-passing demo.
  # The When step captures the dynamic todo ID into scenarioWorld — a per-scenario
  # fixture — so the Then step can reference it without re-querying the DOM.
  # This is playwright-bdd's equivalent of Cucumber's World object.
  Scenario: Captured todo ID is passed between steps via ScenarioWorld
    When I click the Add Todo button
    And I fill in the todo title "ScenarioWorld demo todo"
    And I submit the todo form
    And I capture the ID of the newly added todo "ScenarioWorld demo todo"
    Then the captured todo should appear in the list as unchecked


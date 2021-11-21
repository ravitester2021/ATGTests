context('Context : ATG test', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('Cannot read properties of ')) {
      return false
    }
  })
})

describe('ATG Tests', () => {
  it('Navigate to ATG and accept cookies', () => {
    cy.visit('/')
    cy.title().should('contains', 'ATG')
    cy.log('Visiting ATG Home Page...')
    cy.get('#onetrust-accept-btn-handler').click()
    cy.log('Clicked on “Accept All Cookies” ')
    cy.get('[data-test-id="quicklinks-calendar-horsebetting"]').click()
    cy.log('Clicked on “Spelkander” ')
    cy.location('pathname', { timeout: 8000 }).should('include', '/idag')
    cy.log('Wait for next page to load...')
    cy.get('table').then(() => {
      if (cy.get('table').find('tr').its('length').should('be.gte', 2)) {
        cy.log('Today Match Available')
        startPlaying()
      } else {
        cy.log('No Match for Today, Let\'s Select Next Day!!!')
        cy.get('div[class*="CalendarNavigation-styles--rightArrow"]').click()
        startPlaying()
      }
    })
  })
})

function getRandomArbitrary (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min) + min)
}

function startPlaying () {
  cy.get('table tr:first-child td[class*="highlightsColumn"] a').contains('V3').click()
  .then(() => {
    cy.get('.css-tefqyt-Button-styles--Container-BettableContent-styles--playButton').should('be.visible')
  })

  cy.log('Clicked on requested element...')
  let randomVal = getRandomArbitrary(0, 9)

  cy.log(`randomVal-0 is : ${randomVal}`)
  const randomVal1 = getRandomArbitrary(0, 9)

  cy.log(`randomVal-1 is : ${randomVal1}`)
  const randomVal2 = getRandomArbitrary(0, 9)

  cy.log(`randomVal-2 is : ${randomVal2}`)

  cy.get('div[class*="tooltips-coupon"] div[class*="starts"]')
  .each(($el) => {
    // let cnt = 1
    const avilable_legs_text = $el.text()

    cy.log(`Leg is : ${avilable_legs_text}`)

    cy.wrap($el).find('button').each(($button) => {
      let buttonTxt = $button.text()

      cy.log(`buttonTxt is : ${buttonTxt}`)
      if (buttonTxt == randomVal) {
        cy.wrap($button).click({ force: true })
        cy.log(`Clicked on ${randomVal}`)
      }
    })
  })
}

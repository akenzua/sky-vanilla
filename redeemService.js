const constants = require("./constants");

function redeemService({
  eligibilityService,
  customerAccountNumber,
  portfolio,
}) {
  const data = { data: [] };

  const rewards = (customerSubscription) =>
    typeof constants.associatedRewards[customerSubscription] === "undefined"
      ? []
      : constants.associatedRewards[customerSubscription];

  try {
    const eligibility = eligibilityService(customerAccountNumber);
    if (eligibility !== constants.CUSTOMER_ELIGIBLE) {
      return data;
    }

    return Object.assign(data, {
      data: [].concat.apply([], portfolio.customerSubscriptions.map(rewards)),
    });
  } catch (err) {
    if (err.message === constants.INVALID_ACCOUNT_NUMBER) {
      return Object.assign(data, { invalidAccountNumber: true });
    }

    return data;
  }
}

module.exports = redeemService;

const redeemService = require("./redeemService");
const constants = require("./constants");

describe("redeemService", () => {
  const INVALID = "INVALID_CHANNEL";
  const EligibleCustomerMock = () => constants.CUSTOMER_ELIGIBLE;
  const IneligibleCustomerMock = () => constants.CUSTOMER_INELIGIBLE;
  const TechnicalErrorMock = () => {
    throw new Error(constants.TECHNICAL_FAILURE);
  };
  const InvalidAccountErrorMmock = () => {
    throw new Error(constants.INVALID_ACCOUNT_NUMBER);
  };

  const parameters = {
    eligibilityService: jest.fn(),
    customerAccountNumber: 1234567880,
    portfolio: {
      customerSubscriptions: [],
    },
  };

  const technicalErrorParams = () => ({
    ...parameters,
    ...{ eligibilityService: TechnicalErrorMock },
  });

  const invalidAccountNumberErrorParams = () => ({
    ...parameters,
    ...{ eligibilityService: InvalidAccountErrorMmock },
  });

  const eligibileCustomerAndSubscriptionInfo = (customerSubscriptions) => ({
    ...parameters,
    ...{
      portfolio: {
        customerSubscriptions,
      },
    },
    ...{ eligibilityService: EligibleCustomerMock },
  });

  it("should not return  rewards results for an invalid account number", () => {
    const rewards = redeemService(invalidAccountNumberErrorParams());
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it("should not return  rewards for subscription to only kids channel", () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo(constants.KIDS)
    );
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it("should not return  rewards for subscription to only news channel", () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo(constants.NEWS)
    );
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it('should return "CHAMPIONS_LEAGUE_FINAL_TICKET" reward for subscription only to sport channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.SPORTS])
    );
    expect(rewards.data.length).toBe(1);
    expect(rewards.data).toContain(constants.CHAMPIONS_LEAGUE_FINAL_TICKET);
  });

  it('should return "KARAOKE_PRO_MICROPHONE" reward for subscription only to music channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.MUSIC])
    );
    expect(rewards.data.length).toBe(1);
    expect(rewards.data).toContain(constants.KARAOKE_PRO_MICROPHONE);
  });

  it('should return "PIRATES_OF_THE_CARRIBEAN_COLLECTION" reward for subscription only to movies channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.MOVIES])
    );
    expect(rewards.data.length).toBe(1);
    expect(rewards.data).toContain(
      constants.PIRATES_OF_THE_CARRIBEAN_COLLECTION
    );
  });

  it('should return "CHAMPIONS_LEAGUE_FINAL_TICKET" and "KARAOKE_PRO_MICROPHONE" reward for subscription to sport and music channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.SPORTS, constants.MUSIC])
    );
    expect(rewards.data.length).toBe(2);
    expect(rewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET,
      constants.KARAOKE_PRO_MICROPHONE
    );
  });

  it('should return "PIRATES_OF_THE_CARRIBEAN_COLLECTION" and "KARAOKE_PRO_MICROPHONE" reward for subscription to movies and music channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.MOVIES, constants.MUSIC])
    );
    expect(rewards.data.length).toBe(2);
    expect(rewards.data).toContain(
      constants.PIRATES_OF_THE_CARRIBEAN_COLLECTION,
      constants.KARAOKE_PRO_MICROPHONE
    );
  });

  it('should return "CHAMPIONS_LEAGUE_FINAL_TICKET", "KARAOKE_PRO_MICROPHONE", and "PIRATES_OF_THE_CARRIBEAN_COLLECTION" reward for subscription to all channel', () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([
        constants.SPORTS,
        constants.MUSIC,
        constants.MOVIES,
      ])
    );
    expect(rewards.data.length).toBe(3);
    expect(rewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET,
      constants.KARAOKE_PRO_MICROPHONE,
      constants.PIRATES_OF_THE_CARRIBEAN_COLLECTION
    );
  });

  it("should not return rewards for an ineligible customer", () => {
    const params = {
      ...parameters,
      ...{ eligibilityService: IneligibleCustomerMock },
    };
    const rewards = redeemService(params);
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it("should not return reward for an invalid channel", () => {
    const rewards = redeemService(
      eligibileCustomerAndSubscriptionInfo(INVALID)
    );
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it("should throw error for technical failure", () => {
    const params = {
      ...parameters,
      ...{ eligibilityService: TechnicalErrorMock },
    };
    expect(params.eligibilityService).toThrow(constants.TECHNICAL_FAILURE);
  });

  it("should not return rewards for a technical failure", () => {
    const rewards = redeemService(technicalErrorParams());
    expect(rewards.data.length).toBe(0);
    expect(rewards.data).toEqual([]);
  });

  it("should throw for an invalid account number", () => {
    const params = {
      ...parameters,
      ...{ eligibilityService: InvalidAccountErrorMmock },
    };
    expect(params.eligibilityService).toThrow(constants.INVALID_ACCOUNT_NUMBER);
  });
});

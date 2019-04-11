const SimpleEVoting = artifacts.require("./SimpleEVoting.sol");

contract('SimpleEVoting', function (accounts) {
  
  contract('SimpleEVoting.endProposalRegistration - onlyAdministrator modifier ', function (accounts) {
    it(
      "The voting administrator should be able to end the proposal registration session only after it has started", 
      async function () {
        //arrange 
        let simpleEVotingInstance = await SimpleEVoting.deployed();
        let votingAdministrator = await simpleEVotingInstance.administrator();

        let nonVotingAdministrator = await web3.eth.getAccounts().then(e => e[1])

        try {
          //act
          await simpleEVotingInstance.endProposalsRegistration({ from: nonVotingAdministrator });
          assert.isTrue(false);
        }
        catch (e) {
          //assert
          assert.isTrue(votingAdministrator != nonVotingAdministrator);
          assert.equal(
            e, 
            "Error: Returned error: VM Exception while processing transaction: revert the caller of this function must be the administrator -- Reason given: the caller of this function must be the administrator.");
        }
      });
  });

  contract('SimpleEVoting.endProposalRegistration - onlyDuringProposalsRegistration modifier', function (accounts) {
    it(
      "An account that is not the voting administrator must not be able to end the proposal registration session", 
      async function () {
        //arrange 
        let simpleEVotingInstance = await SimpleEVoting.deployed();
        let votingAdministrator = await simpleEVotingInstance.administrator();

        try {
          //act
          await simpleEVotingInstance.endProposalsRegistration({ from: votingAdministrator });
          assert.isTrue(false);
        }
        catch (e) {
          //assert
          assert.equal(
            e, 
            "Error: Returned error: VM Exception while processing transaction: revert this function can be called only during proposals registration -- Reason given: this function can be called only during proposals registration.");
        }
      });
  });

  contract('SimpleEVoting.endProposalRegistration - successful', function (accounts) {
    it(
      "An account that is not the voting administrator must not be able to end the proposal registration session", 
      async function () {
        //arrange 
        let simpleEVotingInstance = await SimpleEVoting.deployed();
        let votingAdministrator = await simpleEVotingInstance.administrator();

        await simpleEVotingInstance.startProposalsRegistration({ from: votingAdministrator });
        let workflowStatus = await simpleEVotingInstance.getWorkflowStatus();
        let expectedWorkflowStatus = 1;

        assert.equal(
          workflowStatus.valueOf(), 
          expectedWorkflowStatus, 
          "The current workflow status does not correspond to proposal registration session started");

        //act
        await simpleEVotingInstance.endProposalsRegistration({ from: votingAdministrator });
        let newWorkflowStatus = await simpleEVotingInstance.getWorkflowStatus();
        let newExpectedWorkflowStatus = 2;

        //assert
        assert.equal(
          newWorkflowStatus.valueOf(), 
          newExpectedWorkflowStatus, 
          "The current workflow status does not correspond to proposal registration session ended");
    });
  });
});
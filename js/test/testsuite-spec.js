describe("TestCase", function() {

	var testSuite = new TestSuite();
	testSuite.add(sample1);
	testSuite.add(sample2);

  beforeEach(function() {

  });

  it("should be able to get count of test cases", function() {
    expect(testSuite.getLength()).toEqual(2);
  });
  
  it("should not be able to add test case if there is already one with the same name", function() {
	testSuite.add(sample1);
    expect(testSuite.getLength()).toEqual(2);
  });

  it("should be able to add test case with unique name", function() {
	testSuite.add(sample3);
    expect(testSuite.getLength()).toEqual(3);
  });

  it("should be able to get test case by its order number", function() {
	var testcase = testSuite.getByIndex(0);
    expect(testcase.get().id).toEqual(sample1.get().id);
  });

  it("should be able to remove test case by name", function() {
	testSuite.deleteByName(sample2.get().name);
    expect(testSuite.getLength()).toEqual(2);
  });

  it("should be able to remove test case by id", function() {
	testSuite.deleteByID(sample3.get().id);
    expect(testSuite.getLength()).toEqual(1);
  });

});
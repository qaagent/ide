describe("TestCase", function() {
  var testcase;

  beforeEach(function() {

  });
  
  it("should be able to create test case", function() {
	var sampleName = 'sample name';
	var sampleDescription = 'sample description';
	var sampleSource = 'sample source';
	var sampleUrl = 'sample url';
	var id = 1;
    var testCase = new TestCase(sampleName, sampleDescription, sampleSource, sampleUrl, id);
    expect(testCase.get().name).toEqual(sampleName);
	expect(testCase.get().description).toEqual(sampleDescription);
	expect(testCase.get().source).toEqual(sampleSource);
	expect(testCase.get().url).toEqual(sampleUrl);
	expect(testCase.get().id).not.toBe(null);
	expect(testCase.get().id).not.toBeUndefined();
  });

});
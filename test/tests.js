QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "lib init", function( assert ) {
    assert.ok(typeof(window.Ajax) === "function", "Passed!" );
});

QUnit.test( "declare init", function( assert ) {
    var obj = new Autocomplete();
    assert.ok(typeof(obj) === "object", "Passed!" );
});
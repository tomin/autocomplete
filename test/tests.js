QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "fn init", function( assert ) {
    var obj = new Ajax();
    assert.ok(typeof obj == "function", "Passed!" );
});
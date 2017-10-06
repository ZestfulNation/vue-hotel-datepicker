
    var testsContext = require.context("../../tests/unit", false);

    var runnable = testsContext.keys();

    runnable.forEach(testsContext);
    
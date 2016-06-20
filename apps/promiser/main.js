Promiser.main = function main () {

  Promiser.engine = Promiser.Engine.create({});

  Promiser.engine.ignite();

  Promiser.getPath('mainPage.mainPane').append();

};


function main() { Promiser.main(); }

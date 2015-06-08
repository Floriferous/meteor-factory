/* global Factory */
/* global Authors:true, Books:true */

Authors = new Meteor.Collection("authors");
Books = new Meteor.Collection("books");

Tinytest.add("Factory - Build - Basic build works", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  test.equal(Factory.build("author").name, "John Smith");
});

Tinytest.add("Factory - Define - After hook", function(test) {
  var result;

  Factory.define("author", Authors, {
    name: "John Smith"
  }).after(function(doc) {
    result = doc;
  });

  var author = Factory.create("author");
  test.equal(author.name, "John Smith");
  test.equal(result.name, "John Smith");
});

Tinytest.add("Factory - Build - Functions - Basic", function(test) {
  Factory.define("author", Authors, {
    name: function() {
      return "John Smith";
    }
  });

  test.equal(Factory.build("author").name, "John Smith");
});

Tinytest.add("Factory - Build - Functions - Context", function(test) {
  Factory.define("author", Authors, {
    test: "John Smith",
    name: function() {
      return this.test;
    }
  });

  test.equal(Factory.build("author").name, "John Smith");
});

Tinytest.add("Factory - Build - Dotted properties - Basic", function(test) {
  Factory.define("author", Authors, {
    "profile.name": "John Smith"
  });

  test.equal(Factory.build("author").profile.name, "John Smith");
});

Tinytest.add("Factory - Build - Dotted properties - Context", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith",
    "profile.name": function() {
      return this.name;
    }
  });

  test.equal(Factory.build("author").profile.name, "John Smith");
});

Tinytest.add("Factory - Build - Deep objects", function(test) {
  Factory.define("author", Authors, {
    profile: {
      name: "John Smith"
    }
  });

  test.equal(Factory.build("author").profile.name, "John Smith");
});

Tinytest.add("Factory - Build - Functions - Deep object - Basic", function(test) {
  Factory.define("author", Authors, {
    profile: {
      name: function() {
        return "John Smith";
      }
    }
  });

  test.equal(Factory.build("author").profile.name, "John Smith");
});

Tinytest.add("Factory - Build - Functions - Deep object - Context", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith",
    profile: {
      name: function() {
        return this.name;
      }
    }
  });

  test.equal(Factory.build("author").profile.name, "John Smith");
});

Tinytest.add("Factory - Build - Extend - Basic", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("authorOne", Authors, Factory.extend("author"));

  test.equal(Factory.build("authorOne").name, "John Smith");
});

Tinytest.add("Factory - Build - Extend - With attributes", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("authorOne", Authors, Factory.extend("author", {
    test: "testing!"
  }));

  test.equal(Factory.build("authorOne").name, "John Smith");
  test.equal(Factory.build("authorOne").test, "testing!");
});

Tinytest.add("Factory - Build - Extend - With attributes (check that we don't modify the parent)", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("authorOne", Books, Factory.extend("author", {
    test: "testing!"
  }));

  var authorOne = Factory.build("authorOne");
  var author = Factory.build("author");

  test.equal(authorOne.name, "John Smith");
  test.equal(authorOne.test, "testing!");
  test.equal(_.isUndefined(author.test), true);
});

Tinytest.add("Factory - Build - Extend - Parent with relationship", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    authorId: Factory.get("author"),
    name: "A book",
    year: 2014
  });

  Factory.define("bookOne", Books, Factory.extend("book"));

  var bookOne = Factory.create("bookOne");

  test.equal(bookOne.name, "A book");
});

Tinytest.add("Factory - Build - Extend - Parent with relationship - Extra attributes", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    authorId: Factory.get("author"),
    name: "A book",
    year: 2014
  });

  Factory.define("bookOne", Books, Factory.extend("book", {
    name: "A better book"
  }));

  var bookOne = Factory.create("bookOne");

  test.equal(bookOne.name, "A better book");
  // same year as parent
  test.equal(bookOne.year, 2014);
});

Tinytest.add("Factory - Create - Basic", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  var author = Factory.create("author");

  test.equal(author.name, "John Smith");
});

Tinytest.add("Factory - Create - Relationship", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    authorId: Factory.get("author"),
    name: "A book",
    year: 2014
  });

  var book = Factory.create("book");

  test.equal(Authors.findOne(book.authorId).name, "John Smith");
});

Tinytest.add("Factory - Create - Relationship - return a Factory from function", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    authorId: function() {
      return Factory.get("author");
    },
    name: "A book",
    year: 2014
  });

  var book = Factory.create("book");

  test.equal(Authors.findOne(book.authorId).name, "John Smith");
});

Tinytest.add("Factory - Create - Relationship - return a Factory from deep function (dotted)", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    "good.authorId": function() {
      return Factory.get("author");
    },
    name: "A book",
    year: 2014
  });

  var book = Factory.create("book");

  test.equal(Authors.findOne(book.good.authorId).name, "John Smith");
});

Tinytest.add("Factory - Create - Relationship - return a Factory from deep function", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith"
  });

  Factory.define("book", Books, {
    good: {
      authorId: function() {
        return Factory.get("author");
      }
    },
    name: "A book",
    year: 2014
  });

  var book = Factory.create("book");

  test.equal(Authors.findOne(book.good.authorId).name, "John Smith");
});

Tinytest.add("Factory - Build - Sequence", function(test) {
  Factory.define("author", Authors, {
    name: "John Smith",
    email: function(factory) {
      return factory.sequence(function(n) {
        return "person" + n + "@example.com";
      });
    }
  });

  var author = Factory.build("author");
  test.equal(author.email, "person1@example.com");
  var author2 = Factory.build("author");
  test.equal(author2.email, "person2@example.com");
});

Tinytest.add("Factory - Create - Sequence", function(test) {
  Authors.remove({});

  Factory.define("author", Authors, {
    name: "John Smith",
    email: function(factory) {
      return factory.sequence(function(n) {
        return "person" + n + "@example.com";
      });
    }
  });

  var author = Factory.create("author");
  test.equal(author.email, "person1@example.com");
  var foundAuthor = Authors.find({email: "person1@example.com"}).count();
  test.equal(foundAuthor, 1);

  var author2 = Factory.create("author");
  test.equal(author2.email, "person2@example.com");
  var foundAuthor2 = Authors.find({email: "person2@example.com"}).count();
  test.equal(foundAuthor2, 1);
});

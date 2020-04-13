import Dry from "json-dry";

import Businesses from "./Businesses";
import Business from "./Business";

test("simple", () => {
  let name1 = "This is a business";

  let p1 = new Business({ name: name1 });

  let name2 = "This is another business";

  let p2 = new Business({ name: name2 });

  expect(p1.getName()).toStrictEqual(name1);
  expect(p2.getName()).toStrictEqual(name2);
  expect(p1.getID()).toStrictEqual(null);
  expect(p2.getID()).toStrictEqual(null);

  let p = new Businesses();

  p1 = p.add(p1);
  p2 = p.add(p2);

  expect(p1.getID() !== null).toStrictEqual(true);
  expect(p2.getID() !== null).toStrictEqual(true);

  let r = p.find("another");
  expect(r.getID()).toStrictEqual(p2.getID());

  r = p.find("IS A");

  expect(r.length).toStrictEqual(2);

  if (r[0].getID() === p1.getID()) {
    expect(r[1].getID()).toStrictEqual(p2.getID());
  } else {
    expect(r[0].getID()).toStrictEqual(p2.getID());
    expect(r[1].getID()).toStrictEqual(p1.getID());
  }

  let s = Dry.stringify(p);

  p = Dry.parse(s);

  r = p.find("another");
  expect(r.getID()).toStrictEqual(p2.getID());

  r = p.find("IS A");

  expect(r.length).toStrictEqual(2);

  if (r[0].getID() === p1.getID()) {
    expect(r[1].getID()).toStrictEqual(p2.getID());
  } else {
    expect(r[0].getID()).toStrictEqual(p2.getID());
    expect(r[1].getID()).toStrictEqual(p1.getID());
  }
});

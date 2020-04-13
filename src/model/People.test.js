import Dry from "json-dry";

import People from "./People";
import Person from "./Person";

test("simple", () => {
  let state1 = { orig_name: "John Smith", firstnames: ["John"], surnames: ["Smith"] };

  let name1 = "John Smith";

  let p1 = new Person(state1);

  let state2 = { orig_name: "Brunel, Isambard", firstnames: ["Isambard"], surnames: ["Brunel"] };
  let name2 = "Isambard Brunel";

  let p2 = new Person(state2);

  expect(p1.getName()).toStrictEqual(name1);
  expect(p2.getName()).toStrictEqual(name2);
  expect(p1.getID()).toStrictEqual(null);
  expect(p2.getID()).toStrictEqual(null);

  let p = new People();

  p1 = p.add(p1);
  p2 = p.add(p2);

  expect(p1.getID() !== null).toStrictEqual(true);
  expect(p2.getID() !== null).toStrictEqual(true);

  let r = p.find("Brunel");
  expect(r.getID()).toStrictEqual(p2.getID());

  r = p.find("m");

  expect(r.length).toStrictEqual(2);

  if (r[0].getID() === p1.getID()) {
    expect(r[1].getID()).toStrictEqual(p2.getID());
  } else {
    expect(r[0].getID()).toStrictEqual(p2.getID());
    expect(r[1].getID()).toStrictEqual(p1.getID());
  }

  let s = Dry.stringify(p);

  p = Dry.parse(s);

  r = p.find("Brunel");
  expect(r.getID()).toStrictEqual(p2.getID());

  r = p.find("m");

  expect(r.length).toStrictEqual(2);

  if (r[0].getID() === p1.getID()) {
    expect(r[1].getID()).toStrictEqual(p2.getID());
  } else {
    expect(r[0].getID()).toStrictEqual(p2.getID());
    expect(r[1].getID()).toStrictEqual(p1.getID());
  }
});

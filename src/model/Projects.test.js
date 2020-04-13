import Dry from "json-dry";

import Projects from "./Projects";
import Project from "./Project";

test("simple", () => {
  let name1 = "This is a project";
  let url1 = "https://localhost/something";

  let p1 = new Project({ name: name1, url: url1 });

  let name2 = "This is another project";
  let url2 = "https://localhost/other";

  let p2 = new Project({ name: name2, url: url2 });

  expect(p1.getName()).toStrictEqual(name1);
  expect(p2.getName()).toStrictEqual(name2);
  expect(p1.getURL()).toStrictEqual(url1);
  expect(p2.getURL()).toStrictEqual(url2);
  expect(p1.getID()).toStrictEqual(null);
  expect(p2.getID()).toStrictEqual(null);

  let p = new Projects();

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

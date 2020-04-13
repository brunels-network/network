import RoughDate from "./RoughDate";
import DateRange from "./DateRange";

test("simple", () => {
  let a = new RoughDate({ start: "1850-01-01", end: "1850-12-31" });
  let b = new RoughDate({ start: "1851-01-01", end: "1851-12-31" });

  expect(a.getEarliest().toString()).toStrictEqual(RoughDate.min(a, b).toString());
  expect(b.getLatest().toString()).toStrictEqual(RoughDate.max(a, b).toString());

  expect(RoughDate.eq(a, a)).toStrictEqual(true);
  expect(RoughDate.eq(b, b)).toStrictEqual(true);
  expect(RoughDate.eq(a, b)).toStrictEqual(false);

  let c = new RoughDate({ start: "1850-01-01", end: "1850-12-31" });

  expect(RoughDate.eq(a, c)).toStrictEqual(true);
  expect(RoughDate.eq(c, a)).toStrictEqual(true);

  let d = RoughDate.clone(b);

  expect(RoughDate.eq(b, d)).toStrictEqual(true);
  expect(RoughDate.eq(c, d)).toStrictEqual(false);
});

test("intersect", () => {
  let a = new RoughDate({ start: "1823-01-01", end: "1833-12-31" });
  let b = new DateRange({ start: "1830-01-01", end: "1860-01-01" });

  let intersect = new DateRange({ start: "1830-01-01", end: "1833-12-31" });

  expect(b.intersect(a).toString()).toStrictEqual(intersect.toString());

  let m1 = a.toDateRange().getStart();
  let m2 = b.getStart();

  expect(RoughDate.max(m1, m2).toString()).toStrictEqual(m2.toString());
});

test("minmax", () => {
  let a = new RoughDate({ start: "1841-01-01", end: "1841-12-31" });
  let b = new RoughDate("1839-12-08");

  expect(RoughDate.min(a, b).toString()).toStrictEqual(b.toString());
  expect(RoughDate.max(a, b).toString()).toStrictEqual(a.getLatest().toString());
});


import DateRange from './DateRange';

test("simple", ()=>{
  let a = new DateRange();
  expect(a.hasBounds()).toStrictEqual(false);
  expect(a.hasStart()).toStrictEqual(false);
  expect(a.hasEnd()).toStrictEqual(false);

  a = new DateRange({start:"1850-12-02", end:"1850-12-01"});

  expect(a.getStart() < a.getEnd()).toStrictEqual(true);
  expect(a.hasBounds()).toStrictEqual(true);
  expect(a.hasStart()).toStrictEqual(true);
  expect(a.hasEnd()).toStrictEqual(true);
  expect(a.getEnd() - a.getStart()).toStrictEqual(24*60*60*1000);
});

test("intersect", ()=>{
  let a = new DateRange({start:"1850-01-31", end:"1850-12-31"});
  let b = new DateRange({start:"1849-01-31", end:"1850-07-31"});
  let intersect = new DateRange({start:"1850-01-31", end:"1850-07-31"});

  expect(a.intersect(b)).toStrictEqual(intersect);
  expect(b.intersect(a)).toStrictEqual(intersect);

  let union = new DateRange({start:"1849-01-31", end:"1850-12-31"});
  expect(a.union(b)).toStrictEqual(union);
  expect(b.union(a)).toStrictEqual(union);
});

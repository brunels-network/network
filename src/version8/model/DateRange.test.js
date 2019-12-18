
import DateRange from './DateRange';

test("simple", ()=>{
  let a = new DateRange();
  expect(a.hasBounds()).toBe(false);
  expect(a.hasStart()).toBe(false);
  expect(a.hasEnd()).toBe(false);

  a = new DateRange({start:"1850-12-02", end:"1850-12-01"});

  expect(a.getStart() < a.getEnd()).toBe(true);
  expect(a.hasBounds()).toBe(true);
  expect(a.hasStart()).toBe(true);
  expect(a.hasEnd()).toBe(true);
  expect(a.getEnd() - a.getStart()).toBe(24*60*60*1000);
});

test("intersect", ()=>{
  let a = new DateRange({start:"1850-01-31", end:"1850-12-31"});
  let b = new DateRange({start:"1849-01-31", end:"1850-07-31"});
  let intersect = new DateRange({start:"1850-01-31", end:"1850-07-31"});

  expect(a.intersect(b)).toBe(intersect);
});
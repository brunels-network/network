
import RoughDate from './RoughDate';

test("simple", ()=>{
    let a = new RoughDate({start:"1850-01-01", end:"1850-12-31"});
    let b = new RoughDate({start:"1851-01-01", end:"1851-12-31"});

    expect(a.getEarliest().toString()).toStrictEqual(RoughDate.min(a,b).toString());
    expect(b.getLatest().toString()).toStrictEqual(RoughDate.max(a,b).toString());
});

import { GylohWebUntis } from "./api/gyloh_web_untis";

GylohWebUntis.getPlan(new Date(Date.parse("2020-11-26"))).then(res => console.log(res));

setTimeout(() => null, 100000000);
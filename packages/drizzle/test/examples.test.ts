import {describe, it} from "node:test";
import { exampleEmittedTypescript } from "./test-host.js";

describe('examples', ()=>{
    it('Create a simple model',  (t)=>exampleEmittedTypescript(t,`
 @table("blog") model Blog {
 @id id: string;
 };      
    `));
});
import { describe,it,expect } from 'vitest'; import { buildEvening } from './planner';
describe('buildEvening',()=>{it('garde trois objectifs sans créneau microscopique',()=>{const p=buildEvening('18:00',75,'tired',{jobs:0,sport:0,english:0});expect(p).toHaveLength(3);expect(p.every(x=>x.duration>=15)).toBe(true);expect(p[0].kind).toBe('jobs')})})

// src/features/batalla/batallaEngine.js

function calcularStat(base, iv, ev, nivel, esBeneficiado, esPerjudicado, esHP = false) {
    const core = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * nivel) / 100);
    if (esHP) return core + nivel + 10;
    const mult = esBeneficiado ? 1.1 : esPerjudicado ? 0.9 : 1.0;
    return Math.floor((core + 5) * mult);
}

export function calcularStatsFinales(poke, nivel = 50) {
    const ben = poke.naturaleza?.stacks_beneficiado;
    const per = poke.naturaleza?.stacks_perjudicado;
    return {
        hp:      calcularStat(poke.base.hp,      poke.iv_hp,     poke.ev_hp,     nivel, false,          false,           true),
        attack:  calcularStat(poke.base.attack,  poke.iv_attack, poke.ev_attack, nivel, ben==="attack",  per==="attack"),
        defense: calcularStat(poke.base.defense, poke.iv_defense,poke.ev_defense,nivel, ben==="defense", per==="defense"),
        spAtk:   calcularStat(poke.base.spAtk,   poke.iv_sp_atk, poke.ev_sp_atk, nivel, ben==="spAtk",   per==="spAtk"),
        spDef:   calcularStat(poke.base.spDef,   poke.iv_sp_def, poke.ev_sp_def, nivel, ben==="spDef",   per==="spDef"),
        speed:   calcularStat(poke.base.speed,   poke.iv_speed,  poke.ev_speed,  nivel, ben==="speed",   per==="speed"),
    };
}

function calcularDanio(poder, ataque, defensa) {
    return Math.floor((Math.floor((2 * 50 / 5 + 2) * poder * ataque / defensa) / 50) + 2);
}

function elegirMovimiento(movimientos) {
    const validos = (movimientos || []).filter(m => m.power && m.power > 0);
    if (!validos.length) return { nombre: "Placaje", power: 40, categoria: "Físico" };
    return validos[Math.floor(Math.random() * validos.length)];
}

export function simularBatalla(equipoA, equipoB) {
    const log = [];

    const teamA = equipoA.map(p => ({ ...p, stats: calcularStatsFinales(p), hpActual: 0 }));
    const teamB = equipoB.map(p => ({ ...p, stats: calcularStatsFinales(p), hpActual: 0 }));
    teamA.forEach(p => { p.hpActual = p.stats.hp });
    teamB.forEach(p => { p.hpActual = p.stats.hp });

    let idxA = 0, idxB = 0, turno = 1;

    while (idxA < teamA.length && idxB < teamB.length && turno <= 200) {
        const pokeA = teamA[idxA];
        const pokeB = teamB[idxB];
        const movA  = elegirMovimiento(pokeA.movimientosRel);
        const movB  = elegirMovimiento(pokeB.movimientosRel);

        const atkA = movA.categoria === "Especial" ? pokeA.stats.spAtk  : pokeA.stats.attack;
        const defB = movA.categoria === "Especial" ? pokeB.stats.spDef   : pokeB.stats.defense;
        const atkB = movB.categoria === "Especial" ? pokeB.stats.spAtk  : pokeB.stats.attack;
        const defA = movB.categoria === "Especial" ? pokeA.stats.spDef   : pokeA.stats.defense;

        const orden = pokeA.stats.speed >= pokeB.stats.speed
            ? [{ at: pokeA, df: pokeB, mov: movA, atk: atkA, def: defB, esA: true  },
               { at: pokeB, df: pokeA, mov: movB, atk: atkB, def: defA, esA: false }]
            : [{ at: pokeB, df: pokeA, mov: movB, atk: atkB, def: defA, esA: false },
               { at: pokeA, df: pokeB, mov: movA, atk: atkA, def: defB, esA: true  }];

        for (const { at, df, mov, atk, def, esA } of orden) {
            if (df.hpActual <= 0) break;
            const danio = calcularDanio(mov.power || 40, atk, def);
            df.hpActual = Math.max(0, df.hpActual - danio);

            log.push({
                turno,
                atacante:   at.apodo || at.base?.nombre,
                defensor:   df.apodo || df.base?.nombre,
                movimiento: mov.nombre,
                danio,
                hpRestante: df.hpActual,
                hpMax:      df.stats.hp,
                esEquipoA:  esA,
            });

            if (df.hpActual <= 0) {
                log.push({ turno, evento: `¡${df.apodo || df.base?.nombre} se debilitó!`, esEquipoA: !esA });
                if (esA) idxB++; else idxA++;
                break;
            }
        }
        turno++;
    }

    return { log, ganador: idxA < teamA.length ? "A" : "B", turnosTotales: turno };
}
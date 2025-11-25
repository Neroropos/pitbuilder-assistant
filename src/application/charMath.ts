export class CharMath {}
import classesJson from '../assets/ClassesNew.json' assert { type: 'json' }
import templatesJson from '../assets/Templates.json' assert { type: 'json' }
import { escapeRegExp } from './func'

export function GetClassList() {
  const enemies: EnemyClass[] = []
  const classesFromJson = classesJson as unknown as EnemyClass[]
  classesFromJson.forEach((element) => {
    enemies.push(new EnemyClass(element))
  })

  const result: GroupedClass[] = []
  enemies.forEach((item) => {
    const arr = result.find((x) => x.Type == item.Type)
    if (arr) result.find((x) => x.Type == item.Type)?.Values.push(item)
    else {
      const newGroup = new GroupedClass({ Type: item.Type, Values: [item] })
      result.push(newGroup)
    }
  })
  result.forEach((gr) => {
    gr.Values.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
  })
  return result
}
export function GetClassListForPrint() {
  const enemiesPR: EnemyClass[] = []
  const classesPR = classesJson as unknown as EnemyClass[]
  classesPR.forEach((element) => {
    enemiesPR.push(JSON.parse(JSON.stringify(element)))
  })
  const result: EnemyClass[] = []
  enemiesPR.forEach((element) => {
    element.Actions.forEach((act) => (act.Text = parseTextForPrint(act.Text, act.Values)))
    element.Passives.forEach((pas) => (pas.Text = parseTextForPrint(pas.Text, pas.Values)))
    element.PostAttack?.forEach((pos) => (pos.Text = parseTextForPrint(pos.Text, pos.Values)))
    element.Weaknesses?.sort((a, b) => a.localeCompare(b))
    element.Resistances?.sort((a, b) => a.localeCompare(b))
    element.Immunities?.sort((a, b) => a.localeCompare(b))
    result.push(new EnemyClass(element))
  })
  return result.sort((a, b) => a.Type?.localeCompare(b.Type) || a.Name?.localeCompare(b.Name))
}
export function GetTemplateListForPrint() {
  const templatesPR: EnemyTemplate[] = []
  const result: EnemyTemplate[] = []
  const templatesFromJsonPR = templatesJson as unknown as EnemyTemplate[]
  templatesFromJsonPR.forEach((element) => {
    templatesPR.push(JSON.parse(JSON.stringify(element)))
  })
  templatesPR.forEach((element) => {
    element.Actions.forEach((act) => (act.Text = parseTextForPrint(act.Text, act.Values)))
    element.Passives.forEach((pas) => (pas.Text = parseTextForPrint(pas.Text, pas.Values)))
    element.PostAttack?.forEach((pos) => (pos.Text = parseTextForPrint(pos.Text, pos.Values)))
    element.Weaknesses?.sort((a, b) => a.localeCompare(b))
    element.Resistances?.sort((a, b) => a.localeCompare(b))
    element.Immunities?.sort((a, b) => a.localeCompare(b))
    result.push(new EnemyTemplate(element))
  })
  return result.sort((a, b) => a.Type?.localeCompare(b.Type) || a.Name?.localeCompare(b.Name))
}
function parseTextForPrint(text, values) {
  let result = text

  values?.forEach((av, i) => {
    if (av.indexOf('PSTATK') < 0) {
      const newVal = av
        .replace(/DMG/g, 'BD')
        .replace(/BLK/g, 'BB')
        .replace(/MOV/g, 'MV')
        .replace(/DEF/g, 'DS')
        .replace(/OFF/g, 'OS')
        .replace(/TIR/g, 'Tier')
        .replace(/Math.round/g, 'half ')
        .replace('(', '')
        .replace('/2)', '')
      result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), newVal)
    } else result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), '')
  })
  return result
}

export class GroupedClass {
  Type: string = ''
  Values: EnemyClass[] = []
  public constructor(init?: Partial<GroupedClass>) {
    Object.assign(this, init)
  }
}

export class GroupedTemplate {
  Type: string = ''
  Values: EnemyTemplate[] = []
  public constructor(init?: Partial<GroupedTemplate>) {
    Object.assign(this, init)
  }
}

export function GetTemplateList() {
  const templates: EnemyTemplate[] = []
  const templatesFromJson = templatesJson as unknown as EnemyTemplate[]
  templatesFromJson.forEach((element) => {
    templates.push(new EnemyTemplate(element))
  })
  const result: GroupedTemplate[] = []
  templates.forEach((item) => {
    const arr = result.find((x) => x.Type == item.Type)
    if (arr) result.find((x) => x.Type == item.Type)?.Values.push(item)
    else {
      const newGroup = new GroupedTemplate({ Type: item.Type, Values: [item] })
      result.push(newGroup)
    }
  })
  result.forEach((gr) => {
    gr.Values.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
  })
  return result
}
export class Action {
  Name: string = ''
  Text: string = ''
  Values: string[] = []
  public constructor(init?: Partial<Action>) {
    Object.assign(this, init)
  }
}
export class Passive {
  Valid(char: Enemy): boolean {
    if (this.Condition == null) return true
    else if (this.Condition.Check == 'Type') {
      return char.Class.Type == this.Condition.Value
    }
    return true
  }
  Name: string = ''
  Text: string = ''
  Values: string[] = []
  Condition: { Check: string; Value: string } | null = null
  public constructor(init?: Partial<Passive>) {
    Object.assign(this, init)
  }
}
export class PostAttack {
  Name: string = ''
  Text: string = ''
  Values: string[] = []
  public constructor(init?: Partial<PostAttack>) {
    Object.assign(this, init)
  }
}
export class EnemyArchetype {
  Name: string = 'None'
  Actions: Action[] = []
  Passives: Passive[] = []
  Weaknesses: string[] = []
  Resistances: string[] = []
  Immunities: string[] = []
  Strike: string = ''
  Defend: string = ''
  Maneuver: string = ''
  HPMod: number = 0
  public constructor(init?: Partial<EnemyArchetype>) {
    Object.assign(this, init)
  }
}
export class EnemyClass {
  Name: string = ''
  DefScaling: number | number = 1
  OffScaling: number | number = 1
  Actions: Action[] = []
  Passives: Passive[] = []
  Weaknesses: string[] = []
  Resistances: string[] = []
  Immunities: string[] = []
  PostAttack: PostAttack[] = []
  Archetypes: EnemyArchetype[] = []
  Challenge: number | number = 0
  Type: string = ''
  HPBar: number = 0
  Strike: string = ''
  Defend: string = ''
  Maneuver: string = ''
  //Id!: number
  public constructor(init?: Partial<EnemyClass>) {
    this.Resistances = []
    this.Weaknesses = []
    Object.assign(this, init)
  }
}
export class EnemyTemplate {
  GetPassives(char: Enemy): ConcatArray<Passive> {
    const result: Passive[] = []
    this.Passives.forEach((passive) => {
      if (passive.Valid(char)) result.push(passive)
    })
    return result
  }
  Name: string = ''
  DefScaling: number = 0
  OffScaling: number = 0
  HPMod: number = 0
  DmgMod: number = 0
  MoveMod: number = 0
  BlockMod: number = 0
  Actions: Action[] = []
  Passives: Passive[] = []
  Weaknesses: string[] = []
  Resistances: string[] = []
  Immunities: string[] = []
  PostAttack: PostAttack[] = []
  Challenge: number | number = 0
  ChallengeMult: number | number = 1
  HPBar: number = 0
  Type: string = ''
  public constructor(init?: Partial<EnemyTemplate>) {
    Object.assign(this, init)
    this.Passives = []
    if (init?.Passives != undefined)
      init?.Passives.forEach((passive) => {
        this.Passives.push(new Passive(passive))
      })
  }
}
export class Enemy {
  Tier: number | number = 1
  Name: string | null = null
  Class: EnemyClass | EnemyClass = new EnemyClass()
  Templates: EnemyTemplate[] = []

  HPMod: number = 0
  HP: number = 0
  DmgMod: number = 0
  MoveMod: number = 0
  BlockMod: number = 0
  Challenge: number | number = 0
  Actions: Action[] = []
  ActionsShown: { Name: string; Text: string }[] = []
  PassivesShown: { Name: string; Text: string }[] = []
  ResistancesShown: string = ''
  WeaknessesShown: string = ''
  ImmunitiesShown: string = ''
  Passives: Passive[] = []
  PostAttack: string = ''
  HPBar: number = 1
  Strike: string = ''
  Defend: string = ''
  Maneuver: string = ''
  Archetype: EnemyArchetype | EnemyArchetype = new EnemyArchetype()

  replacePlaceholders(DefScaling: number, OffScaling: number, Text: string, Values: string[]) {
    let result = Text

    Values?.forEach((av, i) => {
      if (av.indexOf('PSTATK') < 0) {
        const newVal = av
          .replace(/DMG/g, this.DmgMod.toString())
          .replace(/BLK/g, this.BlockMod.toString())
          .replace(/MOV/g, this.MoveMod.toString())
          .replace(/DEF/g, DefScaling.toString())
          .replace(/OFF/g, OffScaling.toString())
          .replace(/TIR/g, this.Tier.toString())
        result = result.replace(
          new RegExp(escapeRegExp('{' + i + '}'), 'g'),
          eval?.('"use strict";' + newVal).toString()
        )
      } else result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), this.PostAttack)
    })
    return result
  }
  replacePlaceholdersDirect(DefScaling: number, OffScaling: number, Text: string) {
    let result = Text
    const newVal = Text.replace(/DMG/g, this.DmgMod.toString())
      .replace(/BLK/g, this.BlockMod.toString())
      .replace(/MOV/g, this.MoveMod.toString())
      .replace(/DEF/g, DefScaling.toString())
      .replace(/OFF/g, OffScaling.toString())
      .replace(/TIR/g, this.Tier.toString())
    result = newVal.replace(/{([^{}]+)}/g, (_, expr) => {
      try {
        const evalVal = eval(expr)
        const returnVal = Math.max(evalVal, 1)
        return returnVal.toString()
      } catch (e) {
        console.error('Error evaluating:', expr, e)
        return `{${expr}}` // fallback if eval fails
      }
    })
    return result
  }
  update() {
    const DefScaling =
      this.Class?.DefScaling +
      this.Templates?.reduce((sum, current) => sum + current.DefScaling || 0, 0)
    this.HPMod =
      DefScaling * 7 +
      this.Templates?.reduce((sum, current) => sum + current.HPMod || 0, 0) +
      this.Archetype.HPMod
    this.HP = this.Tier * 10 + this.HPMod

    const OffScaling =
      this.Class?.OffScaling +
      this.Templates?.reduce((sum, current) => sum + current.OffScaling || 0, 0)
    this.DmgMod =
      OffScaling * 2 -
      2 +
      this.Templates?.reduce((sum, current) => sum + current.DmgMod || 0, 0) +
      this.Tier * 2

    this.Challenge = Math.round(
      (this.Class?.Challenge +
        this.Templates?.reduce((sum, current) => sum + current.Challenge || 0, 0) +
        this.Tier * 2) *
        this.Templates?.reduce((sum, current) => sum * current.ChallengeMult || 0, 1)
    )

    this.HPBar =
      1 + this.Class.HPBar + this.Templates?.reduce((sum, current) => sum + current.HPBar || 0, 0)
    this.MoveMod = this.Templates?.reduce((sum, current) => sum + current.MoveMod || 0, 0)

    this.BlockMod =
      this.Templates?.reduce((sum, current) => sum + current.BlockMod || 0, 0) -
      2 +
      this.Tier * 2 +
      DefScaling * 2

    this.PostAttack = ''
    const PostAttacks = this.Class?.PostAttack.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.PostAttack), [] as PostAttack[])
    )
    PostAttacks.forEach((p) => {
      if (p.Text)
        this.PostAttack += this.replacePlaceholders(DefScaling, OffScaling, p.Text, p.Values) + ' '
    })
    const Resistances = this.Class?.Resistances.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Resistances), [] as string[])
    ).concat(this.Archetype.Resistances)
    const Weaknesses = this.Class?.Weaknesses.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Weaknesses), [] as string[])
    ).concat(this.Archetype.Weaknesses)
    const Immunities = this.Class?.Immunities.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Immunities), [] as string[])
    ).concat(this.Archetype.Immunities)
    const TotalledRWI: { name: string; value: number }[] = []
    Resistances.forEach((res) => {
      const item = TotalledRWI.find((x) => x.name == res)
      if (item) item.value++
      else TotalledRWI.push({ name: res, value: 1 })
    })
    Weaknesses.forEach((wea) => {
      const item = TotalledRWI.find((x) => x.name == wea)
      if (item) item.value--
      else TotalledRWI.push({ name: wea, value: -1 })
    })
    Immunities.forEach((imm) => {
      const item = TotalledRWI.find((x) => x.name == imm)
      if (item) item.value += 2
      else TotalledRWI.push({ name: imm, value: 2 })
    })
    // const ResistancesFiltered = Resistances.filter((x) => !Weaknesses.find((y) => y == x)).filter(
    //   (value, index, array) => array.indexOf(value) === index
    // )
    // const WeaknessesFiltered = Weaknesses.filter((x) => !Resistances.find((y) => y == x)).filter(
    //   (value, index, array) => array.indexOf(value) === index
    // )

    this.Strike = this.replacePlaceholdersDirect(
      DefScaling,
      OffScaling,
      this.Archetype.Strike != '' ? this.Archetype.Strike : this.Class.Strike
    )
    this.Defend = this.replacePlaceholdersDirect(
      DefScaling,
      OffScaling,
      this.Archetype.Defend != '' ? this.Archetype.Defend : this.Class.Defend
    )
    this.Maneuver = this.replacePlaceholdersDirect(
      DefScaling,
      OffScaling,
      this.Archetype.Maneuver != '' ? this.Archetype.Maneuver : this.Class.Maneuver
    )

    //Do actions and HP

    this.ResistancesShown = TotalledRWI.filter((x) => x.value == 1)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((x) => x.name)
      .join(', ') //ResistancesFiltered.sort((a, b) => a.localeCompare(b)).join(', ')
    this.WeaknessesShown = TotalledRWI.filter((x) => x.value < 0)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((x) => x.name)
      .join(', ') // this.WeaknessesShown = WeaknessesFiltered.sort((a, b) => a.localeCompare(b)).join(', ')
    this.ImmunitiesShown = TotalledRWI.filter((x) => x.value > 1)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((x) => x.name)
      .join(', ') // this.ImmunitiesShown = Immunities.sort((a, b) => a.localeCompare(b)).join(', ')
    this.Actions = this.Class?.Actions.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Actions), [] as Action[])
    ).concat(
      this.Archetype.Actions.filter((a) => !this.Class.Actions.some((c) => c.Name == a.Name))
    )
    this.ActionsShown = []
    this.Actions.forEach((a) => {
      let text = a.Text
      if (this.Archetype.Actions.find((x) => x.Name == a.Name)) {
        text = this.Archetype.Actions.find((x) => x.Name == a.Name)?.Text as string
      }
      if (text != '')
        this.ActionsShown.push({
          Name: a.Name || '',
          Text: this.replacePlaceholdersDirect(DefScaling, OffScaling, text)
        })
    })
    this.Passives = this.Class?.Passives.concat(
      this.Templates?.reduce(
        (sum, current) => sum.concat(current.GetPassives(this)),
        [] as Passive[]
      )
    ).concat(
      this.Archetype.Passives.filter((a) => !this.Class.Passives.some((c) => c.Name == a.Name))
    )
    if (this.Passives.find((x) => x.Name == 'Grunt')) {
      this.HP = 1
    }
    this.PassivesShown = []
    this.Passives.forEach((p) => {
      let text = p.Text
      if (this.Archetype.Passives.find((x) => x.Name == p.Name)) {
        text = this.Archetype.Passives.find((x) => x.Name == p.Name)?.Text as string
      }
      if (text != '')
        this.PassivesShown.push({
          Name: p.Name || '',
          Text: this.replacePlaceholdersDirect(DefScaling, OffScaling, text)
        })
    })
  }
}

# Claude handoff: ПІСЛЯСВІТ v0.9.40 / macro optical effects

ЦЕ **ПОВНИЙ ПАКЕТ ФАЙЛІВ НА ОСНОВІ v0.9.39**, А НЕ НОВА ЗІБРАНА ГРА. Claude має створити v0.9.40 самостійно.

1. Прочитай **CLAUDE_TASK_V0940_UA.md**.
2. Відкрий **spalakh3d/Spalakh_NeonObservatory_ONLY_v0939_RealLight_RoundAura_SlowSpiders.json** — оригінальний редагований GDevelop-проєкт із вбудованим JS.
3. **spalakh3d/patches/Observatory_v0939_full.js** — точна копія скрипту події; синхронізувати після змін.
4. **ASSET_MANIFEST_V0939.json** — список усіх 105 ресурсів із точними Git SHA, локальними відносними шляхами та оригінальними URL. У ZIP включені **бінарні файли GLB / PNG / WEBP тощо** за цими шляхами.
5. \`python validate_base.py\` перевіряє цілісність проєкту, JSON/JS та всі фізичні файли ресурсів.

**Не змінюй ігровий код за межами візуальної частини. Ніякого автономного web-player!**

База:
- repo: https://github.com/mickalaykorolyov-bit/pislyasvit-spalakh
- source branch: spalakh-25d-clean-sprite-physical-light-v0939
- GDevelop scene: Observatory3D_FalseLight
- Native project: spalakh3d/Spalakh_NeonObservatory_ONLY_v0939_RealLight_RoundAura_SlowSpiders.json
- Full JS: spalakh3d/patches/Observatory_v0939_full.js

**Важлива примітка щодо асетів:** в полі \`resources.resources[].file\` оригінального JSON залишаються URL raw.githubusercontent.com, потрібні для відкриття через GDevelop Editor. Усі 105 зареєстрованих ресурсів у цьому handoff ZIP додатково лежать локально. Якщо тобі потрібно тестувати без інтернету, підлаштуй asset path на копії JSON, але не руйнуй URL в основному результаті без перевірки.

Цільове завдання: мікроскопічний Спалах розміром із блоху, сильно розмиті світні корали на передньому плані, DOF сцени, дуже делікатне lens distortion / chromatic aberration, HUD завжди чіткий.

**Результат очікується не концепт, а редагований GDevelop JSON + синхронний JS + changelog.**

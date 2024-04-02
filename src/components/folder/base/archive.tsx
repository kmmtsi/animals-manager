{/* 共有設定 */}
<div className={formFieldGapY}>
<label htmlFor="share" className={label}>
  {t("shareConfig")}
</label>
<select
  id="share"
  name="share"
  className={select}
  value={share}
  onChange={(e) => setShare(e.target.value as Share)}
>
  {shareOptions.map((opt, i) => (
    <option key={i} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>
</div>
{/* アクセスできるユーザー */}
{share === "invitedUsers" && (
<div className={formFieldGapY}>
  <label className={label}>アクセスできるユーザー</label>
  {/* TODO変更 */}
  <SearchInput
    searchKey="email"
    maxSelect={maxAccessUser}
    maxInput={100}
    placeholder={t("searchUsers")}
    currentItems={invitedUsers}
    setItems={setInvitedUsers}
    renderItem={(item) => <div>{item.email}</div>}
    suggestableItems={suggestableUsers}
  />
</div>
)}
router.post("/invitations/accept", async (req, res) => {
  const { token, fullname, password } = req.body;

  try {
    const invitation = await Invitation.findOne({ token });
    if (!invitation) return res.status(400).json({ message: "Ungültiger oder abgelaufener Token" });

    // Prüfen, ob ein User mit dieser E-Mail schon existiert
    let user = await User.findOne({ email: invitation.email });

    if (!user) {
      // Neuen User registrieren
      user = new User({ email: invitation.email, fullname });
      await user.setPassword(password); // z. B. wenn du Passport / bcrypt verwendest
      await user.save();
    }

    // Zum Board hinzufügen
    const board = await Board.findById(invitation.boardId);
    if (!board) return res.status(404).json({ message: "Board nicht gefunden" });

    const alreadyMember = board.members.find(m => m.user.equals(user._id));
    if (!alreadyMember) {
      board.members.push({ user: user._id, role: invitation.role });
      await board.save();
    }

    // Einladung löschen
    await invitation.deleteOne();

    res.status(200).json({ message: "Einladung akzeptiert", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Verarbeiten der Einladung" });
  }
});

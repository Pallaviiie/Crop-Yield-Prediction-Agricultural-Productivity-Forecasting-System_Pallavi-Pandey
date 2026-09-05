from app.models.activity_log import ActivityLog


def log_activity(
    db,
    action,
    actor=None,
    actor_name=None,
    actor_role=None,
    details=None,
    log_type="info",
):
    """
    Create a persistent activity log.

    This function commits the log separately so that
    activity logging does not interfere with the main
    business transaction.
    """

    try:
        if actor is not None:
            actor_id = getattr(actor, "id", None)

            if actor_name is None:
                actor_name = getattr(
                    actor,
                    "full_name",
                    None,
                ) or getattr(
                    actor,
                    "email",
                    None,
                )

            if actor_role is None:
                actor_role = getattr(
                    actor,
                    "role",
                    None,
                )
        else:
            actor_id = None

        log = ActivityLog(
            action=action,
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            details=details,
            type=log_type,
        )

        db.add(log)
        db.commit()

        return log

    except Exception as exc:
        print(
            f"[ActivityLog] Failed to save activity: {exc}"
        )

        db.rollback()

        return None
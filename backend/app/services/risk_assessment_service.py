def calculate_risk_assessment(data):
    risks = []
    total_score = 0

    rainfall = float(data.get("rainfall", 0) or 0)
    temperature = float(data.get("temperature", 0) or 0)
    soil_ph = float(data.get("soil_ph", 0) or 0)
    fertilizer = float(data.get("fertilizer", 0) or 0)
    pesticide = float(data.get("pesticide", 0) or 0)

    # =========================
    # RAINFALL RISK
    # =========================

    if rainfall < 500:
        score = 25
        level = "High"
        message = "Low rainfall may cause water stress and reduce crop productivity."

    elif rainfall > 1500:
        score = 20
        level = "Moderate"
        message = "High rainfall may increase the risk of waterlogging."

    else:
        score = 5
        level = "Low"
        message = "Rainfall conditions appear suitable."

    total_score += score

    risks.append({
        "category": "Rainfall Risk",
        "level": level,
        "score": score,
        "message": message
    })

    # =========================
    # TEMPERATURE RISK
    # =========================

    if temperature > 35:
        score = 25
        level = "High"
        message = "High temperature may cause crop heat stress."

    elif temperature < 10:
        score = 20
        level = "Moderate"
        message = "Low temperature may slow crop growth."

    else:
        score = 5
        level = "Low"
        message = "Temperature conditions appear suitable."

    total_score += score

    risks.append({
        "category": "Temperature Risk",
        "level": level,
        "score": score,
        "message": message
    })

    # =========================
    # SOIL pH RISK
    # =========================

    if soil_ph == 0:
        score = 10
        level = "Moderate"
        message = "Soil pH information is not available for complete soil risk analysis."

    elif soil_ph < 5.5 or soil_ph > 7.5:
        score = 20
        level = "High"
        message = "Soil pH is outside the generally suitable range."

    else:
        score = 5
        level = "Low"
        message = "Soil pH appears suitable."

    total_score += score

    risks.append({
        "category": "Soil Health Risk",
        "level": level,
        "score": score,
        "message": message
    })

    # =========================
    # FERTILIZER RISK
    # =========================

    if fertilizer == 0:
        score = 15
        level = "Moderate"
        message = "No fertilizer amount was entered. Nutrient availability may be insufficient."

    else:
        score = 5
        level = "Low"
        message = "Fertilizer input has been provided."

    total_score += score

    risks.append({
        "category": "Nutrient Risk",
        "level": level,
        "score": score,
        "message": message
    })

    # =========================
    # PESTICIDE RISK
    # =========================

    if pesticide > 5:
        score = 15
        level = "Moderate"
        message = "High pesticide usage may create environmental and crop health concerns."

    else:
        score = 5
        level = "Low"
        message = "Pesticide usage appears within the configured threshold."

    total_score += score

    risks.append({
        "category": "Pest Management Risk",
        "level": level,
        "score": score,
        "message": message
    })

    # =========================
    # OVERALL RISK
    # =========================

    total_score = min(total_score, 100)

    if total_score <= 30:
        overall_risk = "Low"

    elif total_score <= 60:
        overall_risk = "Moderate"

    else:
        overall_risk = "High"

    return {
        "overall_risk_score": total_score,
        "overall_risk_level": overall_risk,
        "risks": risks
    }
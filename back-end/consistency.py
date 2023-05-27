from blanc import Estime
estimator = Estime()
text = """In Kander’s telling, Mandel called him up out of the blue a decade or so ago to pitch a project. It made sense why. The two men had similar profiles: Jewish combat veterans in their early 30s. New statewide officeholders in the Midwest."""
summary = """Kander and Mandel had similar profiles, and it makes sense."""
estimator.evaluate_claims(text, [summary])
print("hjhhj")
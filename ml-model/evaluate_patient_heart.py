
import argparse
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    ConfusionMatrixDisplay,
)
from sklearn.model_selection import cross_val_score, StratifiedKFold

from preprocess_patient_heart import preprocess, FINAL_FEATURES




def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate patient heart disease model")
    parser.add_argument("--data",  default="patient_heart.csv",      help="Path to raw CSV dataset")
    parser.add_argument("--model", default="models/heart_patient.pkl", help="Path to saved .pkl pipeline")
    parser.add_argument("--test-size", type=float, default=0.2,       help="Test split ratio (default 0.2)")
    parser.add_argument("--seed",  type=int,   default=42,            help="Random seed")
    return parser.parse_args()



def load_model(path: str):
    with open(path, "rb") as f:
        return pickle.load(f)


def print_section(title: str) -> None:
    print(f"\n{'='*55}")
    print(f"  {title}")
    print(f"{'='*55}")




def evaluate(model, X_test: pd.DataFrame, y_test: pd.Series) -> dict:
    y_pred      = model.predict(X_test)
    y_prob      = model.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy":  accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall":    recall_score(y_test, y_pred, zero_division=0),
        "f1":        f1_score(y_test, y_pred, zero_division=0),
        "roc_auc":   roc_auc_score(y_test, y_prob),
        "y_pred":    y_pred,
        "y_prob":    y_prob,
    }
    return metrics


def cross_validate(model, X: pd.DataFrame, y: pd.Series, seed: int) -> None:
    print_section("5-Fold Stratified Cross-Validation")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)

    for metric in ("accuracy", "f1", "roc_auc"):
        scores = cross_val_score(model, X, y, cv=cv, scoring=metric)
        print(f"  {metric:<12}  mean={scores.mean():.4f}  std={scores.std():.4f}  "
              f"min={scores.min():.4f}  max={scores.max():.4f}")




def plot_confusion_matrix(y_test, y_pred) -> None:
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["No Disease", "Disease"])
    fig, ax = plt.subplots(figsize=(5, 4))
    disp.plot(ax=ax, colorbar=False, cmap="Blues")
    ax.set_title("Confusion Matrix – Patient Heart Model")
    plt.tight_layout()
    plt.savefig("eval_confusion_matrix_patient_heart.png", dpi=150)
    print("\n  ✅ Saved: eval_confusion_matrix_patient_heart.png")
    plt.close()


def plot_roc_curve(y_test, y_prob) -> None:
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    auc = roc_auc_score(y_test, y_prob)

    fig, ax = plt.subplots(figsize=(5, 4))
    ax.plot(fpr, tpr, color="royalblue", lw=2, label=f"AUC = {auc:.4f}")
    ax.plot([0, 1], [0, 1], color="grey", linestyle="--", lw=1)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title("ROC Curve – Patient Heart Model")
    ax.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig("eval_roc_curve_patient_heart.png", dpi=150)
    print("  ✅ Saved: eval_roc_curve_patient_heart.png")
    plt.close()


def plot_feature_importance(model, feature_names: list) -> None:
    estimator = model.named_steps.get("model")
    if not hasattr(estimator, "feature_importances_"):
        print("  ⚠️  Model does not expose feature_importances_ — skipping importance plot.")
        return

    importances = estimator.feature_importances_
    indices     = np.argsort(importances)[::-1]

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(range(len(importances)), importances[indices], color="steelblue")
    ax.set_xticks(range(len(importances)))
    ax.set_xticklabels([feature_names[i] for i in indices], rotation=45, ha="right", fontsize=9)
    ax.set_title("Feature Importances – Patient Heart Model")
    ax.set_ylabel("Importance")
    plt.tight_layout()
    plt.savefig("eval_feature_importance_patient_heart.png", dpi=150)
    print("  ✅ Saved: eval_feature_importance_patient_heart.png")
    plt.close()




def main():
    args = parse_args()

    print_section("Loading Data")
    raw = pd.read_csv(args.data)
    print(f"  Rows loaded : {len(raw)}")

    df = preprocess(raw)
    print(f"  Rows after clean : {len(df)}")

    X = df[FINAL_FEATURES]
    y = df["target"]

    from sklearn.model_selection import train_test_split
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=args.test_size, random_state=args.seed
    )

    print_section("Loading Model")
    model = load_model(args.model)
    print(f"  Loaded from : {args.model}")

    print_section("Hold-out Test Set Metrics")
    m = evaluate(model, X_test, y_test)

    print(f"  Accuracy  : {m['accuracy']:.4f}")
    print(f"  Precision : {m['precision']:.4f}")
    print(f"  Recall    : {m['recall']:.4f}")
    print(f"  F1 Score  : {m['f1']:.4f}")
    print(f"  ROC-AUC   : {m['roc_auc']:.4f}")

    print_section("Classification Report")
    print(classification_report(y_test, m["y_pred"],
                                target_names=["No Disease", "Disease"]))

    cross_validate(model, X, y, args.seed)

    print_section("Generating Plots")
    plot_confusion_matrix(y_test, m["y_pred"])
    plot_roc_curve(y_test, m["y_prob"])
    plot_feature_importance(model, FINAL_FEATURES)

    print_section("Evaluation Complete")


if __name__ == "__main__":
    main()


import argparse
import joblib
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
    precision_recall_curve,
    average_precision_score,
)
from sklearn.model_selection import (
    cross_val_score,
    StratifiedKFold,
    train_test_split,
)

from preprocess_doctor_diabetes import preprocess_data, FINAL_FEATURES, TARGET



def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate doctor diabetes model")
    parser.add_argument("--data",      default="diabetes_doctor.csv",        help="Path to raw CSV dataset")
    parser.add_argument("--model",     default="models/diabetes_doctor.pkl", help="Path to saved .pkl pipeline")
    parser.add_argument("--test-size", type=float, default=0.2,              help="Test split ratio (default 0.2)")
    parser.add_argument("--seed",      type=int,   default=42,               help="Random seed")
    parser.add_argument("--threshold", type=float, default=0.5,              help="Decision threshold (default 0.5)")
    return parser.parse_args()



def load_pipeline(path: str):
    return joblib.load(path)


def print_section(title: str) -> None:
    print(f"\n{'='*55}")
    print(f"  {title}")
    print(f"{'='*55}")


def apply_threshold(y_prob: np.ndarray, threshold: float) -> np.ndarray:
    return (y_prob >= threshold).astype(int)




def evaluate(pipeline, X_test: pd.DataFrame, y_test: pd.Series, threshold: float) -> dict:
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    y_pred = apply_threshold(y_prob, threshold)

    return {
        "accuracy":  accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall":    recall_score(y_test, y_pred, zero_division=0),
        "f1":        f1_score(y_test, y_pred, zero_division=0),
        "roc_auc":   roc_auc_score(y_test, y_prob),
        "avg_prec":  average_precision_score(y_test, y_prob),
        "y_pred":    y_pred,
        "y_prob":    y_prob,
    }


def cross_validate(pipeline, X: pd.DataFrame, y: pd.Series, seed: int) -> None:
    """
    Pipeline already contains the scaler, so cross_val_score is leak-free.
    """
    print_section("5-Fold Stratified Cross-Validation")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)

    for metric in ("accuracy", "f1", "roc_auc", "recall"):
        scores = cross_val_score(pipeline, X, y, cv=cv, scoring=metric)
        print(f"  {metric:<12}  mean={scores.mean():.4f}  std={scores.std():.4f}  "
              f"min={scores.min():.4f}  max={scores.max():.4f}")



def threshold_analysis(y_test: pd.Series, y_prob: np.ndarray) -> None:
    print_section("Threshold Sensitivity Analysis")
    print(f"  {'Threshold':<12} {'Precision':<12} {'Recall':<12} {'F1':<10}")
    print(f"  {'-'*46}")
    for t in np.arange(0.3, 0.75, 0.05):
        y_pred_t = apply_threshold(y_prob, t)
        p = precision_score(y_test, y_pred_t, zero_division=0)
        r = recall_score(y_test, y_pred_t, zero_division=0)
        f = f1_score(y_test, y_pred_t, zero_division=0)
        print(f"  {t:<12.2f} {p:<12.4f} {r:<12.4f} {f:<10.4f}")




def plot_confusion_matrix(y_test, y_pred) -> None:
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["No Diabetes", "Diabetes"])
    fig, ax = plt.subplots(figsize=(5, 4))
    disp.plot(ax=ax, colorbar=False, cmap="Blues")
    ax.set_title("Confusion Matrix – Doctor Diabetes Model")
    plt.tight_layout()
    plt.savefig("eval_confusion_matrix_doctor_diabetes.png", dpi=150)
    print("\n  ✅ Saved: eval_confusion_matrix_doctor_diabetes.png")
    plt.close()


def plot_roc_curve(y_test, y_prob) -> None:
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    auc = roc_auc_score(y_test, y_prob)

    fig, ax = plt.subplots(figsize=(5, 4))
    ax.plot(fpr, tpr, color="steelblue", lw=2, label=f"AUC = {auc:.4f}")
    ax.plot([0, 1], [0, 1], color="grey", linestyle="--", lw=1)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title("ROC Curve – Doctor Diabetes Model")
    ax.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig("eval_roc_curve_doctor_diabetes.png", dpi=150)
    print("  ✅ Saved: eval_roc_curve_doctor_diabetes.png")
    plt.close()


def plot_precision_recall_curve(y_test, y_prob) -> None:
    precision, recall, _ = precision_recall_curve(y_test, y_prob)
    ap = average_precision_score(y_test, y_prob)

    fig, ax = plt.subplots(figsize=(5, 4))
    ax.plot(recall, precision, color="steelblue", lw=2, label=f"AP = {ap:.4f}")
    ax.set_xlabel("Recall")
    ax.set_ylabel("Precision")
    ax.set_title("Precision-Recall Curve – Doctor Diabetes Model")
    ax.legend(loc="upper right")
    plt.tight_layout()
    plt.savefig("eval_pr_curve_doctor_diabetes.png", dpi=150)
    print("  ✅ Saved: eval_pr_curve_doctor_diabetes.png")
    plt.close()


def plot_feature_importance(pipeline, feature_names: list) -> None:
    estimator = pipeline.named_steps.get("model")
    if not hasattr(estimator, "feature_importances_"):
        print("  ⚠️  Model does not expose feature_importances_ — skipping importance plot.")
        return

    importances = estimator.feature_importances_
    indices     = np.argsort(importances)[::-1]

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.bar(range(len(importances)), importances[indices], color="steelblue")
    ax.set_xticks(range(len(importances)))
    ax.set_xticklabels([feature_names[i] for i in indices], rotation=45, ha="right", fontsize=8)
    ax.set_title("Feature Importances – Doctor Diabetes Model")
    ax.set_ylabel("Importance")
    plt.tight_layout()
    plt.savefig("eval_feature_importance_doctor_diabetes.png", dpi=150)
    print("  ✅ Saved: eval_feature_importance_doctor_diabetes.png")
    plt.close()




def main():
    args = parse_args()

    print_section("Loading Data")
    raw = pd.read_csv(args.data)
    print(f"  Rows loaded      : {len(raw)}")
    print(f"  Class balance    : {raw[TARGET].value_counts().to_dict()}")

    df = preprocess_data(raw)
    print(f"  Rows after clean : {len(df)}")

    X = df[FINAL_FEATURES]
    y = df[TARGET]

    _, X_test, _, y_test = train_test_split(
        X, y, test_size=args.test_size, random_state=args.seed, stratify=y
    )

    print_section("Loading Pipeline")
    pipeline = load_pipeline(args.model)
    print(f"  Loaded from : {args.model}")
    print(f"  Steps       : {list(pipeline.named_steps.keys())}")
    print(f"  Threshold   : {args.threshold}")

    print_section("Hold-out Test Set Metrics")
    m = evaluate(pipeline, X_test, y_test, args.threshold)

    print(f"  Accuracy       : {m['accuracy']:.4f}")
    print(f"  Precision      : {m['precision']:.4f}")
    print(f"  Recall         : {m['recall']:.4f}")
    print(f"  F1 Score       : {m['f1']:.4f}")
    print(f"  ROC-AUC        : {m['roc_auc']:.4f}")
    print(f"  Avg Precision  : {m['avg_prec']:.4f}")

    print_section("Classification Report")
    print(classification_report(y_test, m["y_pred"],
                                target_names=["No Diabetes", "Diabetes"]))

    threshold_analysis(y_test, m["y_prob"])

    cross_validate(pipeline, X, y, args.seed)

    print_section("Generating Plots")
    plot_confusion_matrix(y_test, m["y_pred"])
    plot_roc_curve(y_test, m["y_prob"])
    plot_precision_recall_curve(y_test, m["y_prob"])
    plot_feature_importance(pipeline, FINAL_FEATURES)

    print_section("Evaluation Complete")


if __name__ == "__main__":
    main()